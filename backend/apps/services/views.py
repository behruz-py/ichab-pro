from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from core.views import PublicReadAdminWriteMixin
from .models import Service
from .serializers import ServiceListSerializer, ServiceDetailSerializer, ServiceWriteSerializer


class ServiceViewSet(PublicReadAdminWriteMixin, viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["is_active", "division"]
    search_fields = ["name_uz", "name_ru", "name_en"]
    ordering_fields = ["order", "created_at"]

    def get_queryset(self):
        qs = Service.objects.select_related("division").prefetch_related("images").order_by("order")
        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(is_active=True)
        return qs

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return ServiceWriteSerializer
        if self.action == "retrieve":
            return ServiceDetailSerializer
        return ServiceListSerializer
