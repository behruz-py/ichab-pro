import io
import json
from pathlib import Path

import pytest
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image

from apps.products.models import Product, ProductCategory

pytestmark = pytest.mark.django_db
VRU = json.loads((Path(__file__).resolve().parents[1] / "catalog/products/vru.json").read_text(encoding="utf-8"))


@pytest.fixture(autouse=True)
def tmp_media(settings, tmp_path):
    settings.STORAGES = {**settings.STORAGES, "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"}}
    settings.MEDIA_ROOT = tmp_path


def png(name="p.png"):
    buf = io.BytesIO(); Image.new("RGB", (4, 4), "red").save(buf, "PNG")
    return SimpleUploadedFile(name, buf.getvalue(), content_type="image/png")


def test_import_requires_staff(api_client):
    assert api_client.post("/api/v1/products/import/", VRU, format="json").status_code in (401, 403)
    Product.objects.create(slug="x", name_uz="X")
    assert api_client.get("/api/v1/products/x/export/").status_code in (401, 403)


def test_import_real_product_file_and_roundtrip(admin_client):
    res = admin_client.post("/api/v1/products/import/", VRU, format="json")
    assert res.status_code == 201, res.data
    p = Product.objects.get(slug=VRU["slug"])
    assert p.name_ru == "Устройство вводно-распределительное (ВРУ)" and p.sku == "ВРУ"
    assert p.category.slug == "power-distribution" and p.category.name_en == "Power distribution equipment"
    assert [s.value for s in p.specs.order_by("order")][-1] == "TN-C(S)" and p.specs.count() == 11

    # public detail renders the right language
    ru = admin_client.get(f"/api/v1/products/{p.slug}/?lang=en").data
    assert ru["specs"][0]["label"] == "Rated voltage, V"

    # export -> re-import is a no-op
    exported = admin_client.get(f"/api/v1/products/{p.slug}/export/").data
    again = admin_client.post("/api/v1/products/import/", exported, format="json")
    assert again.status_code == 200 and again.data == exported
    assert Product.objects.count() == 1 and ProductCategory.objects.count() == 1


def test_specs_are_replaced_and_absent_keys_kept(admin_client):
    admin_client.post("/api/v1/products/import/", VRU, format="json")
    admin_client.post("/api/v1/products/import/", {"slug": VRU["slug"], "name_uz": "Yangi nom",
                                                   "specs": [{"label_uz": "A", "value": "1"}]}, format="json")
    p = Product.objects.get(slug=VRU["slug"])
    assert p.name_uz == "Yangi nom" and p.name_ru == VRU["name_ru"]  # untouched field kept
    assert list(p.specs.values_list("value", flat=True)) == ["1"]


def test_images_upload_and_reuse_stored_path(admin_client):
    default_storage.save("products/images/old.png", ContentFile(png().read()))
    data = {**VRU, "images": [{"path": "products/images/old.png", "is_main": True}, {"file": "img1"}]}
    res = admin_client.post("/api/v1/products/import/", {"data": json.dumps(data), "img1": png("new.png")}, format="multipart")
    assert res.status_code == 201, res.data
    imgs = list(Product.objects.get(slug=VRU["slug"]).images.order_by("order"))
    assert imgs[0].image.name == "products/images/old.png" and imgs[0].is_main
    assert imgs[1].image.name.startswith("products/images/new") and default_storage.exists(imgs[1].image.name)


def test_bad_payloads_are_rejected_without_partial_writes(admin_client):
    bad = {**VRU, "images": [{"path": "products/images/missing.png"}]}
    res = admin_client.post("/api/v1/products/import/", bad, format="json")
    assert res.status_code == 400 and "does not exist" in res.data["detail"]
    assert not Product.objects.exists()  # transaction rolled back
    assert admin_client.post("/api/v1/products/import/", {"slug": "x"}, format="json").status_code == 400
    assert admin_client.post("/api/v1/products/import/", {**VRU, "availability": "soon"}, format="json").status_code == 400


def test_variant_table_roundtrip(admin_client):
    table = {"parameters": [{"label_uz": "Tok", "label_ru": "Ток", "label_en": "Current", "unit": "A"}, {"label_uz": "Massa", "unit": "kg"}],
             "variants": [{"code": "ВРУ-1", "values": ["630", "120"]}, {"code": "ВРУ-2", "values": ["1000", "150"]}]}
    admin_client.post("/api/v1/products/import/", {**VRU, "variant_table": table}, format="json")
    exported = admin_client.get(f"/api/v1/products/{VRU['slug']}/export/").data
    assert exported["variant_table"]["variants"][1] == {"code": "ВРУ-2", "values": ["1000", "150"]}
    bad = {**VRU, "variant_table": {"parameters": table["parameters"], "variants": [{"code": "X", "values": ["1"]}]}}
    assert admin_client.post("/api/v1/products/import/", bad, format="json").status_code == 400
