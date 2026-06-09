from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from core.views import PublicReadAdminWriteMixin
from .models import Partner
from .serializers import PartnerSerializer, PartnerWriteSerializer


class PartnerViewSet(PublicReadAdminWriteMixin, viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["is_active", "is_featured"]
    search_fields = ["name_uz", "name_ru", "name_en"]
    ordering_fields = ["order"]

    def get_queryset(self):
        qs = Partner.objects.order_by("order")
        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(is_active=True)
        return qs

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return PartnerWriteSerializer
        return PartnerSerializer
