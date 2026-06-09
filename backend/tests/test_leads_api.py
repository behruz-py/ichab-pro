import pytest
from apps.leads.models import Lead


@pytest.mark.django_db
class TestLeadAPI:
    def test_create_lead_public(self, api_client):
        res = api_client.post(
            "/api/v1/leads/",
            {
                "name": "Bahodir Yusupov",
                "phone": "+998901234567",
                "message": "PLC tizimi qurish bo'yicha maslahat",
                "source_page": "/contact",
            },
            format="json",
        )
        assert res.status_code == 201
        assert Lead.objects.filter(name="Bahodir Yusupov").exists()
        lead = Lead.objects.get(name="Bahodir Yusupov")
        assert lead.status == Lead.Status.NEW

    def test_create_lead_validation(self, api_client):
        """Phone va email ikkalasi ham bo'lmasa — xato."""
        res = api_client.post(
            "/api/v1/leads/",
            {"name": "Test User"},
            format="json",
        )
        assert res.status_code == 400

    def test_list_leads_requires_admin(self, api_client):
        res = api_client.get("/api/v1/leads/")
        assert res.status_code in (401, 403)

    def test_list_leads_as_admin(self, admin_client):
        Lead.objects.create(name="Test", phone="+998", status=Lead.Status.NEW)
        res = admin_client.get("/api/v1/leads/")
        assert res.status_code == 200
        assert res.data["count"] == 1

    def test_status_update_as_admin(self, admin_client):
        lead = Lead.objects.create(name="Test", phone="+998", status=Lead.Status.NEW)
        res = admin_client.patch(
            f"/api/v1/leads/{lead.pk}/",
            {"status": "done"},
            format="json",
        )
        assert res.status_code == 200
        lead.refresh_from_db()
        assert lead.status == Lead.Status.DONE
