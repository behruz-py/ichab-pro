from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from core.views import PublicReadAdminWriteMixin
from .models import ProductCategory, Product
from .serializers import (
    ProductCategoryListSerializer, ProductCategoryWriteSerializer,
    ProductListSerializer, ProductDetailSerializer, ProductWriteSerializer,
)


class ProductCategoryViewSet(PublicReadAdminWriteMixin, viewsets.ModelViewSet):
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["is_active"]
    search_fields = ["name_uz", "name_ru", "name_en"]
    ordering_fields = ["order"]

    def get_queryset(self):
        qs = ProductCategory.objects.order_by("order")
        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(is_active=True)
        return qs

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return ProductCategoryWriteSerializer
        return ProductCategoryListSerializer


class ProductViewSet(PublicReadAdminWriteMixin, viewsets.ModelViewSet):
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["is_active", "category", "category__slug", "availability", "brand"]
    search_fields = ["name_uz", "name_ru", "name_en", "sku", "brand"]
    ordering_fields = ["order", "created_at", "name_uz"]

    def get_queryset(self):
        qs = (
            Product.objects
            .select_related("category")
            .prefetch_related("images", "specs")
            .order_by("order")
        )
        # Detail view also needs the variant matrix (rows × columns × cells)
        if self.action == "retrieve":
            qs = qs.prefetch_related("parameters", "variants__values")
        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(is_active=True)
        return qs

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return ProductWriteSerializer
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductListSerializer
