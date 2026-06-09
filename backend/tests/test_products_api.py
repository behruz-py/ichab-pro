import pytest
from apps.products.models import ProductCategory, Product


@pytest.fixture
def category(db):
    return ProductCategory.objects.create(
        name_uz="PLC", name_ru="ПЛК", name_en="PLC",
        slug="test-plc", order=1, is_active=True,
    )


@pytest.fixture
def product(db, category):
    return Product.objects.create(
        name_uz="Siemens S7-1200",
        name_ru="Siemens S7-1200",
        name_en="Siemens S7-1200",
        slug="test-s7-1200",
        category=category,
        specifications=[
            {"label_uz": "Kirish", "label_ru": "Входы", "label_en": "Inputs", "value": "14"}
        ],
        order=1, is_active=True,
    )


@pytest.mark.django_db
class TestProductCategoryAPI:
    def test_list(self, api_client, category):
        res = api_client.get("/api/v1/products/categories/")
        assert res.status_code == 200
        assert res.data["count"] == 1

    def test_hierarchical_children(self, api_client, category):
        child = ProductCategory.objects.create(
            name_uz="Siemens SIMATIC", slug="test-simatic",
            parent=category, order=1, is_active=True,
        )
        res = api_client.get(f"/api/v1/products/categories/{category.pk}/")
        assert res.status_code == 200
        assert len(res.data["children"]) == 1
        assert res.data["children"][0]["slug"] == "test-simatic"

    def test_filter_by_parent(self, api_client, category):
        ProductCategory.objects.create(
            name_uz="Child", slug="test-child", parent=category, order=1, is_active=True
        )
        res = api_client.get(f"/api/v1/products/categories/?parent={category.pk}")
        assert res.data["count"] == 1


@pytest.mark.django_db
class TestProductAPI:
    def test_list(self, api_client, product):
        res = api_client.get("/api/v1/products/")
        assert res.status_code == 200
        assert res.data["count"] == 1
        assert res.data["results"][0]["name"] == "Siemens S7-1200"

    def test_detail_has_specifications(self, api_client, product):
        res = api_client.get(f"/api/v1/products/{product.pk}/")
        assert res.status_code == 200
        assert isinstance(res.data["specifications"], list)
        assert res.data["specifications"][0]["value"] == "14"

    def test_filter_by_category(self, api_client, product, category):
        res = api_client.get(f"/api/v1/products/?category={category.pk}")
        assert res.data["count"] == 1

    def test_search(self, api_client, product):
        res = api_client.get("/api/v1/products/?search=Siemens")
        assert res.data["count"] == 1
        res2 = api_client.get("/api/v1/products/?search=notexist123")
        assert res2.data["count"] == 0

    def test_lang_switch(self, api_client, product):
        res = api_client.get(f"/api/v1/products/{product.pk}/?lang=ru")
        assert res.data["name"] == "Siemens S7-1200"
