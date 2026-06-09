from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class TranslatedModel(TimeStampedModel):
    """
    Abstract base for models with uz/ru/en translations.
    Subclasses add their own translated fields with this naming convention:
        field_uz, field_ru, field_en
    A helper `translate(lang)` is provided to get the right field value.
    """

    class Meta:
        abstract = True

    def translate(self, field: str, lang: str = "uz") -> str:
        """Return field value for given lang, fallback chain: uz → ru → en."""
        supported = ("uz", "ru", "en")
        lang = lang if lang in supported else "uz"
        for l in (lang, "uz", "ru", "en"):
            value = getattr(self, f"{field}_{l}", None)
            if value:
                return value
        return ""


class OrderedModel(models.Model):
    order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        abstract = True
        ordering = ["order"]


class ActiveModel(models.Model):
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        abstract = True
