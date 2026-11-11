import json

from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from core.views import PublicReadAdminWriteMixin
from .models import ProductCategory, Product
from .catalog_io import ImportError_, export_product, import_product
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

    def get_permissions(self):
        # export exposes every language and inactive fields, so it is staff-only
        # even though it is a GET.
        if self.action in ("export", "import_product"):
            return [permissions.IsAdminUser()]
        return super().get_permissions()

    @action(detail=True, methods=["get"])
    def export(self, request, slug=None):
        return Response(export_product(self.get_object()))

    @action(detail=False, methods=["post"], url_path="import", parser_classes=[JSONParser, MultiPartParser])
    def import_product(self, request):
        """JSON body, or multipart with the JSON in a `data` field plus image files."""
        payload = request.data.get("data") if "data" in request.data else request.data
        if isinstance(payload, str):
            try:
                payload = json.loads(payload)
            except json.JSONDecodeError as e:
                return Response({"detail": f"Invalid JSON in 'data': {e}"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            product, created = import_product(dict(payload), request.FILES)
        except ImportError_ as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(export_product(product), status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
