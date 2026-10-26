import pytest
from django.contrib.auth import get_user_model

from apps.internal.models import InternalDataset

User = get_user_model()


@pytest.fixture
def employee(db):
    return User.objects.create_user(
        username="xodim", password="Xodim-Pass-2026", first_name="Ali", last_name="Valiyev"
    )


@pytest.fixture
def dataset(db):
    return InternalDataset.objects.create(
        key="cost_estimate", title="Xarajatlar smetasi", data=[{"bSum": "90 200"}]
    )


def _login(api_client, username="xodim", password="Xodim-Pass-2026"):
    res = api_client.post(
        "/api/v1/auth/token/", {"username": username, "password": password}, format="json"
    )
    assert res.status_code == 200
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {res.data['access']}")


@pytest.mark.django_db
class TestInternalDatasets:
    def test_anonymous_is_rejected(self, api_client, dataset):
        res = api_client.get("/api/v1/internal/datasets/")
        assert res.status_code == 401
        assert b"90 200" not in res.content

    def test_non_staff_employee_can_read(self, api_client, employee, dataset):
        _login(api_client)
        res = api_client.get("/api/v1/internal/datasets/")
        assert res.status_code == 200
        assert res.data == {"cost_estimate": [{"bSum": "90 200"}]}

    def test_deactivated_employee_cannot_log_in(self, api_client, employee, dataset):
        employee.is_active = False
        employee.save()
        res = api_client.post(
            "/api/v1/auth/token/",
            {"username": "xodim", "password": "Xodim-Pass-2026"},
            format="json",
        )
        assert res.status_code == 401


@pytest.mark.django_db
class TestMe:
    def test_anonymous_is_rejected(self, api_client):
        assert api_client.get("/api/v1/auth/me/").status_code == 401

    def test_returns_full_name(self, api_client, employee):
        _login(api_client)
        res = api_client.get("/api/v1/auth/me/")
        assert res.status_code == 200
        assert res.data == {"username": "xodim", "full_name": "Ali Valiyev"}
