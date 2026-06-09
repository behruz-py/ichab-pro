from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductCategoryViewSet, ProductViewSet, ProductImageViewSet

router = DefaultRouter()
router.register("categories", ProductCategoryViewSet, basename="product-category")
router.register("images", ProductImageViewSet, basename="product-image")
router.register("", ProductViewSet, basename="product")

urlpatterns = [
    path("", include(router.urls)),
]
