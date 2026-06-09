from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from core.views import PublicReadAdminWriteMixin
from .models import ProductCategory, Product, ProductImage
from .serializers import (
    ProductCategoryListSerializer, ProductCategoryDetailSerializer, ProductCategoryWriteSerializer,
    ProductListSerializer, ProductDetailSerializer, ProductWriteSerializer,
    ProductImageSerializer,
)


class ProductCategoryViewSet(PublicReadAdminWriteMixin, viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["is_active", "parent"]
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
        if self.action == "retrieve":
            return ProductCategoryDetailSerializer
        return ProductCategoryListSerializer


class ProductViewSet(PublicReadAdminWriteMixin, viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["is_active", "category"]
    search_fields = ["name_uz", "name_ru", "name_en"]
    ordering_fields = ["order", "created_at"]

    def get_queryset(self):
        qs = Product.objects.select_related("category").prefetch_related("images").order_by("order")
        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(is_active=True)
        return qs

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return ProductWriteSerializer
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductListSerializer


class ProductImageViewSet(PublicReadAdminWriteMixin, viewsets.ModelViewSet):
    serializer_class = ProductImageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["product", "is_main"]

    def get_queryset(self):
        return ProductImage.objects.order_by("-is_main", "order")
