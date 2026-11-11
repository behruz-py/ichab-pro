"""Delete stored files (R2 in production) when the row that owns them goes away.

Django never removes a FileField's file on its own, so every image deleted or
replaced in the admin used to stay in the bucket forever. These handlers, wired
to every model with a FileField/ImageField:

- after a row is deleted, delete each of its files;
- when a row is saved with a different file (replaced or cleared), delete the
  old one.

Two safeguards:

- Deletion is deferred to ``transaction.on_commit``, so a rolled-back delete
  or save never loses a file.
- A file is kept while any row in any model still references the same storage
  name. The catalogue importer re-attaches existing files by path, and one
  image can back several rows.
"""
import logging

from django.apps import apps
from django.db import models, transaction
from django.db.models.signals import post_delete, pre_save

logger = logging.getLogger(__name__)


def _file_fields(model):
    return [f for f in model._meta.concrete_fields if isinstance(f, models.FileField)]


def _models_with_files():
    return [m for m in apps.get_models() if not m._meta.abstract and _file_fields(m)]


def is_referenced(name: str) -> bool:
    for m in _models_with_files():
        for f in _file_fields(m):
            if m._base_manager.filter(**{f.name: name}).exists():
                return True
    return False


def _schedule_delete(storage, name):
    def run():
        if is_referenced(name):
            return
        try:
            storage.delete(name)
        except Exception:  # a missing file or storage hiccup must not break the request
            logger.exception("Could not delete stored file %s", name)

    transaction.on_commit(run)


def _on_delete(sender, instance, **kwargs):
    for f in _file_fields(sender):
        file = getattr(instance, f.name)
        if file and file.name:
            _schedule_delete(file.storage, file.name)


def _on_save(sender, instance, raw=False, **kwargs):
    if raw or instance._state.adding or not instance.pk:
        return
    fields = _file_fields(sender)
    old = sender._base_manager.filter(pk=instance.pk).only(*[f.name for f in fields]).first()
    if old is None:
        return
    for f in fields:
        before, after = getattr(old, f.name), getattr(instance, f.name)
        if before and before.name and before.name != (after.name if after else None):
            _schedule_delete(before.storage, before.name)


def connect():
    for m in _models_with_files():
        label = m._meta.label
        post_delete.connect(_on_delete, sender=m, dispatch_uid=f"file-cleanup-delete-{label}")
        pre_save.connect(_on_save, sender=m, dispatch_uid=f"file-cleanup-save-{label}")
