import pytest
from django.urls import reverse
from apps.divisions.models import Division, DivisionStat, DivisionCapability


@pytest.mark.django_db
class TestDivisionAPI:
    def _create(self):
        return Division.objects.create(
            name_uz="Avtomatlashtirish bo'limi",
            name_ru="Отдел автоматизации",
            name_en="Automation Division",
            short_description_uz="Qisqa tavsif",
            is_active=True,
            order=1,
        )

    def test_list_public(self, api_client):
        self._create()
        res = api_client.get("/api/v1/divisions/")
        assert res.status_code == 200
        assert res.data["count"] == 1
        assert res.data["results"][0]["name"] == "Avtomatlashtirish bo'limi"

    def test_list_lang_ru(self, api_client):
        self._create()
        res = api_client.get("/api/v1/divisions/?lang=ru")
        assert res.status_code == 200
        assert res.data["results"][0]["name"] == "Отдел автоматизации"

    def test_detail_public(self, api_client):
        div = self._create()
        res = api_client.get(f"/api/v1/divisions/{div.slug}/")
        assert res.status_code == 200
        assert res.data["slug"] == div.slug
        # Nested lab-content lists are always present, even when empty.
        assert res.data["stats"] == []
        assert res.data["capabilities"] == []
        assert res.data["related_projects"] == []

    def test_detail_includes_nested_lab_content(self, api_client):
        div = self._create()
        DivisionStat.objects.create(division=div, value=15, suffix="+", label_uz="Yillik tajriba", order=1)
        DivisionCapability.objects.create(division=div, title_uz="PLC dasturlash", order=1)
        res = api_client.get(f"/api/v1/divisions/{div.slug}/")
        assert res.status_code == 200
        assert len(res.data["stats"]) == 1
        assert res.data["stats"][0]["value"] == 15
        assert res.data["stats"][0]["label"] == "Yillik tajriba"
        assert res.data["capabilities"][0]["title"] == "PLC dasturlash"

    def test_inactive_hidden_from_public(self, api_client):
        Division.objects.create(name_uz="Nofaol", is_active=False, order=2)
        res = api_client.get("/api/v1/divisions/")
        assert res.data["count"] == 0

    def test_create_requires_admin(self, api_client):
        # 401 = unauthenticated, 403 = authenticated but not staff — both are "denied"
        res = api_client.post("/api/v1/divisions/", {"name_uz": "Test"})
        assert res.status_code in (401, 403)

    def test_create_as_admin(self, admin_client):
        res = admin_client.post(
            "/api/v1/divisions/",
            {"name_uz": "Yangi bo'lim", "order": 1, "is_active": True},
            format="json",
        )
        assert res.status_code == 201
        assert Division.objects.filter(name_uz="Yangi bo'lim").exists()
