from rest_framework import viewsets, mixins, filters, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Lead
from .serializers import LeadCreateSerializer, LeadAdminSerializer


class LeadViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status"]
    search_fields = ["name", "company", "phone", "email"]
    ordering_fields = ["created_at", "status"]

    def get_queryset(self):
        return Lead.objects.order_by("-created_at")

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_serializer_class(self):
        if self.action == "create":
            return LeadCreateSerializer
        return LeadAdminSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        lead = serializer.save()
        # Fire-and-forget notify task (Celery) — graceful fallback if not configured
        try:
            from .tasks import notify_new_lead
            notify_new_lead.delay(lead.pk)
        except Exception:
            pass
        return Response(
            {"detail": "Murojaatingiz qabul qilindi. Tez orada bog'lanamiz!"},
            status=status.HTTP_201_CREATED,
        )
