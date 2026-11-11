import importlib

import pytest
from django.apps import apps
from django.core.files.uploadedfile import SimpleUploadedFile

from apps.partners.models import Partner

pytestmark = pytest.mark.django_db
mig = importlib.import_module("apps.partners.migrations.0003_partner_official_names")


def _partner(name, **kw):
    logo = SimpleUploadedFile("l.png", b"\x89PNG\r\n\x1a\n", content_type="image/png")
    return Partner.objects.create(name_uz=name, logo=logo, **kw)


def test_official_names_migration_renames_raw_rows_only():
    raw = _partner("eh")
    hand = _partner("Siemens AG", description_uz="O'zimiz yozgan")
    keep_desc = _partner("navoiyazot", description_uz="Bizning tavsif")

    mig.forwards(apps, None)

    raw.refresh_from_db(); hand.refresh_from_db(); keep_desc.refresh_from_db()
    assert raw.name_uz == raw.name_en == "Endress+Hauser"
    assert raw.kind == "technology" and raw.country_ru == "Швейцария"
    assert raw.description_uz.startswith("Texnologik")
    assert hand.name_uz == "Siemens AG" and hand.description_uz == "O'zimiz yozgan"
    assert keep_desc.kind == "industry" and keep_desc.name_ru == "АО «Навоиазот»"
    assert keep_desc.description_uz == "Bizning tavsif"


def test_partner_api_exposes_kind_and_translated_country(client):
    _partner("ABB", kind="technology", country_uz="Shveytsariya", country_en="Switzerland")
    _partner("Zavod", kind="industry")
    body = client.get("/api/v1/partners/?lang=en").json()
    abb = next(p for p in body["results"] if p["name"] == "ABB")
    assert abb["kind"] == "technology" and abb["country"] == "Switzerland"
    only = client.get("/api/v1/partners/?kind=industry").json()
    assert [p["name"] for p in only["results"]] == ["Zavod"]
