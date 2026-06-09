from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from core.views import PublicReadAdminWriteMixin
from .models import Project, ProjectImage
from .serializers import (
    ProjectListSerializer, ProjectDetailSerializer, ProjectWriteSerializer,
    ProjectImageSerializer,
)


class ProjectViewSet(PublicReadAdminWriteMixin, viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["is_active", "division"]
    search_fields = ["name_uz", "name_ru", "name_en", "client_uz"]
    ordering_fields = ["order", "completed_date"]

    def get_queryset(self):
        qs = Project.objects.select_related("division").prefetch_related("images").order_by("order")
        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(is_active=True)
        return qs

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return ProjectWriteSerializer
        if self.action == "retrieve":
            return ProjectDetailSerializer
        return ProjectListSerializer


class ProjectImageViewSet(PublicReadAdminWriteMixin, viewsets.ModelViewSet):
    serializer_class = ProjectImageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["project", "is_main"]

    def get_queryset(self):
        return ProjectImage.objects.order_by("-is_main", "order")
