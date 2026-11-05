import pytest
from django.db import connection
from django.test.utils import CaptureQueriesContext

from apps.projects.models import Project


@pytest.fixture
def projects(db):
    return [
        Project.objects.create(name_uz=f"Loyiha {i}", client_uz="NKMK", description_uz=f"Tavsif {i}", order=i)
        for i in range(25)
    ]


@pytest.mark.django_db
class TestProjectList:
    def test_default_page_size_is_20(self, api_client, projects):
        res = api_client.get("/api/v1/projects/")
        assert res.data["count"] == 25
        assert len(res.data["results"]) == 20

    def test_page_size_param_is_honoured(self, api_client, projects):
        res = api_client.get("/api/v1/projects/?page_size=50")
        assert len(res.data["results"]) == 25
        assert res.data["next"] is None

    def test_page_size_is_capped(self, api_client, projects):
        res = api_client.get("/api/v1/projects/?page_size=100000")
        assert res.status_code == 200
        assert len(res.data["results"]) == 25

    def test_list_includes_description(self, api_client, projects):
        res = api_client.get("/api/v1/projects/?page_size=50")
        assert res.data["results"][0]["description"] == "Tavsif 0"

    def test_query_count_does_not_grow_per_project(self, api_client, projects):
        with CaptureQueriesContext(connection) as ctx:
            api_client.get("/api/v1/projects/?page_size=50")
        assert len(ctx.captured_queries) <= 5
