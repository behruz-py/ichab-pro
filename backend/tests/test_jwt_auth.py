import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
class TestJWTAuth:
    def _create_user(self):
        return User.objects.create_user(
            username="testadmin", password="SecurePass123!", is_staff=True
        )

    def test_obtain_token(self, api_client):
        self._create_user()
        res = api_client.post(
            "/api/v1/auth/token/",
            {"username": "testadmin", "password": "SecurePass123!"},
            format="json",
        )
        assert res.status_code == 200
        assert "access" in res.data
        assert "refresh" in res.data

    def test_wrong_credentials(self, api_client):
        self._create_user()
        res = api_client.post(
            "/api/v1/auth/token/",
            {"username": "testadmin", "password": "wrongpass"},
            format="json",
        )
        assert res.status_code == 401

    def test_refresh_token(self, api_client):
        self._create_user()
        res = api_client.post(
            "/api/v1/auth/token/",
            {"username": "testadmin", "password": "SecurePass123!"},
            format="json",
        )
        refresh = res.data["refresh"]
        res2 = api_client.post(
            "/api/v1/auth/token/refresh/",
            {"refresh": refresh},
            format="json",
        )
        assert res2.status_code == 200
        assert "access" in res2.data

    def test_protected_endpoint_with_token(self, api_client):
        self._create_user()
        token_res = api_client.post(
            "/api/v1/auth/token/",
            {"username": "testadmin", "password": "SecurePass123!"},
            format="json",
        )
        access = token_res.data["access"]
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        res = api_client.get("/api/v1/leads/")
        assert res.status_code == 200
