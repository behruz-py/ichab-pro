from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from core.views import PublicReadAdminWriteMixin
from .models import Division
from .serializers import DivisionListSerializer, DivisionDetailSerializer, DivisionWriteSerializer


class DivisionViewSet(PublicReadAdminWriteMixin, viewsets.ModelViewSet):
    queryset = Division.objects.filter(is_active=True).order_by("order")
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["is_active"]
    search_fields = ["name_uz", "name_ru", "name_en"]
    ordering_fields = ["order", "created_at"]

    def get_queryset(self):
        qs = Division.objects.order_by("order")
        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(is_active=True)
        return qs

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return DivisionWriteSerializer
        if self.action == "retrieve":
            return DivisionDetailSerializer
        return DivisionListSerializer
