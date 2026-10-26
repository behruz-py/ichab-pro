import pytest
from django.core.files.uploadedfile import SimpleUploadedFile

from apps.services.models import Service, ServiceImage

# 1x1 transparent GIF
GIF = (
    b"GIF89a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xff\xff\xff!\xf9\x04\x01\x00"
    b"\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
)


def _img(name):
    return SimpleUploadedFile(name, GIF, content_type="image/gif")


@pytest.fixture
def media_tmp(settings, tmp_path):
    settings.MEDIA_ROOT = tmp_path
    settings.STORAGES = {**settings.STORAGES, "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"}}


def _list_cover(api_client, slug):
    res = api_client.get("/api/v1/services/")
    assert res.status_code == 200
    return next(s["cover_image"] for s in res.data["results"] if s["slug"] == slug)


@pytest.mark.django_db
class TestServiceListCover:
    def test_no_images_gives_null(self, api_client):
        Service.objects.create(slug="bare", name_uz="Bare")
        assert _list_cover(api_client, "bare") is None

    def test_falls_back_to_main_gallery_image(self, api_client, media_tmp):
        s = Service.objects.create(slug="gallery", name_uz="Gallery")
        ServiceImage.objects.create(service=s, image=_img("first.gif"), order=0)
        ServiceImage.objects.create(service=s, image=_img("main.gif"), is_main=True, order=1)
        cover = _list_cover(api_client, "gallery")
        assert cover.startswith("http") and "main" in cover

    def test_cover_image_wins_over_gallery(self, api_client, media_tmp):
        s = Service.objects.create(slug="covered", name_uz="Covered", cover_image=_img("cover.gif"))
        ServiceImage.objects.create(service=s, image=_img("gal.gif"), is_main=True)
        assert "cover" in _list_cover(api_client, "covered")
