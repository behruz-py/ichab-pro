import io

import pytest
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.db import transaction
from PIL import Image

from apps.partners.models import Partner
from apps.products.catalog_io import import_product
from apps.products.models import Product, ProductImage

pytestmark = pytest.mark.django_db


@pytest.fixture(autouse=True)
def tmp_media(settings, tmp_path):
    settings.STORAGES = {**settings.STORAGES, "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"}}
    settings.MEDIA_ROOT = tmp_path


def png():
    buf = io.BytesIO(); Image.new("RGB", (4, 4), "blue").save(buf, "PNG")
    return ContentFile(buf.getvalue(), name="x.png")


def make_image(product, **kw):
    img = ProductImage(product=product, **kw)
    img.image.save("photo.png", png(), save=True)
    return img


def test_deleting_an_image_row_deletes_its_file(django_capture_on_commit_callbacks):
    p = Product.objects.create(slug="a", name_uz="A")
    img = make_image(p)
    name = img.image.name
    assert default_storage.exists(name)
    with django_capture_on_commit_callbacks(execute=True):
        img.delete()
    assert not default_storage.exists(name)


def test_deleting_a_product_deletes_its_images(django_capture_on_commit_callbacks):
    p = Product.objects.create(slug="a", name_uz="A")
    names = [make_image(p).image.name for _ in range(2)]
    with django_capture_on_commit_callbacks(execute=True):
        p.delete()
    assert not any(default_storage.exists(n) for n in names)


def test_file_still_referenced_by_another_row_is_kept(django_capture_on_commit_callbacks):
    p = Product.objects.create(slug="a", name_uz="A")
    first = make_image(p)
    second = ProductImage(product=p); second.image.name = first.image.name; second.save()
    with django_capture_on_commit_callbacks(execute=True):
        first.delete()
    assert default_storage.exists(second.image.name)


def test_replacing_or_clearing_a_file_deletes_the_old_one(django_capture_on_commit_callbacks):
    partner = Partner(name_uz="P"); partner.logo.save("logo.png", png(), save=True)
    old = partner.logo.name
    with django_capture_on_commit_callbacks(execute=True):
        partner.logo.save("logo2.png", png(), save=True)
    assert not default_storage.exists(old) and default_storage.exists(partner.logo.name)
    p = Product.objects.create(slug="a", name_uz="A", catalog_file=ContentFile(b"%PDF", name="c.pdf"))
    pdf = p.catalog_file.name
    with django_capture_on_commit_callbacks(execute=True):
        p.catalog_file = None; p.save()
    assert not default_storage.exists(pdf)


def test_rolled_back_delete_keeps_the_file():
    p = Product.objects.create(slug="a", name_uz="A")
    img = make_image(p)
    with pytest.raises(RuntimeError):
        with transaction.atomic():
            img.delete()
            raise RuntimeError
    assert default_storage.exists(img.image.name)


def test_import_reattaching_a_stored_path_keeps_the_file(django_capture_on_commit_callbacks):
    p = Product.objects.create(slug="a", name_uz="A")
    name = make_image(p, is_main=True).image.name
    with django_capture_on_commit_callbacks(execute=True):
        import_product({"slug": "a", "name_uz": "A", "images": [{"path": name, "is_main": True}]})
    assert default_storage.exists(name) and p.images.get().image.name == name
