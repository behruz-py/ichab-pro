import pytest
from apps.pages.models import PageContent
from apps.stats.models import Statistic


@pytest.fixture
def page_block(db):
    return PageContent.objects.create(
        key="about_mission",
        title_uz="Bizning missiyamiz",
        title_ru="Наша миссия",
        title_en="Our Mission",
        body_uz="O'zbekiston sanoatini modernizatsiya qilish.",
        body_ru="Модернизация промышленности Узбекистана.",
        body_en="Modernizing Uzbekistan's industry.",
        order=1, is_active=True,
    )


@pytest.mark.django_db
class TestPageContentAPI:
    def test_list(self, api_client, page_block):
        res = api_client.get("/api/v1/pages/")
        assert res.status_code == 200
        assert res.data["count"] == 1

    def test_by_key(self, api_client, page_block):
        res = api_client.get("/api/v1/pages/by-key/about_mission/")
        assert res.status_code == 200
        assert res.data["key"] == "about_mission"
        assert res.data["title"] == "Bizning missiyamiz"

    def test_by_key_lang_ru(self, api_client, page_block):
        res = api_client.get("/api/v1/pages/by-key/about_mission/?lang=ru")
        assert res.data["title"] == "Наша миссия"
        assert res.data["body"] == "Модернизация промышленности Узбекистана."

    def test_by_key_404(self, api_client):
        res = api_client.get("/api/v1/pages/by-key/nonexistent/")
        assert res.status_code == 404


@pytest.mark.django_db
class TestStatisticAPI:
    def test_list(self, api_client):
        Statistic.objects.create(
            label_uz="Loyihalar", label_ru="Проекты", label_en="Projects",
            value=280, suffix_uz="+", suffix_ru="+", suffix_en="+",
            order=1, is_active=True,
        )
        res = api_client.get("/api/v1/stats/")
        assert res.status_code == 200
        assert res.data["count"] == 1
        stat = res.data["results"][0]
        assert stat["value"] == 280
        assert stat["label"] == "Loyihalar"
        assert stat["suffix"] == "+"

    def test_lang_switch(self, api_client):
        Statistic.objects.create(
            label_uz="Loyihalar", label_ru="Проекты", label_en="Projects",
            value=280, suffix_uz="+", suffix_ru="+", suffix_en="+",
            order=1, is_active=True,
        )
        res = api_client.get("/api/v1/stats/?lang=ru")
        assert res.data["results"][0]["label"] == "Проекты"
