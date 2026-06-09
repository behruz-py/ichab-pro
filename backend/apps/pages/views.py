from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from core.views import PublicReadAdminWriteMixin
from .models import PageContent
from .serializers import PageContentSerializer, PageContentWriteSerializer


class PageContentViewSet(PublicReadAdminWriteMixin, viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["is_active"]
    search_fields = ["key", "title_uz", "title_ru", "title_en"]
    ordering_fields = ["order"]

    def get_queryset(self):
        qs = PageContent.objects.order_by("order")
        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(is_active=True)
        return qs

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return PageContentWriteSerializer
        return PageContentSerializer

    @action(detail=False, methods=["get"], url_path="by-key/(?P<key>[^/.]+)")
    def by_key(self, request, key=None):
        """GET /api/v1/pages/by-key/{key}/ — fetch single block by key."""
        obj = self.get_queryset().filter(key=key).first()
        if not obj:
            return Response({"detail": "Not found."}, status=404)
        serializer = PageContentSerializer(obj, context={"request": request})
        return Response(serializer.data)
