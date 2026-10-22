from rest_framework import viewsets, mixins, filters, permissions, status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
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

    def get_throttles(self):
        # Rate-limit only the public, unauthenticated create endpoint (anti-spam).
        # Keyed by client IP — safe because the contact form submits from the
        # browser, not the SSR server. Admin actions stay unthrottled.
        if self.action == "create":
            self.throttle_scope = "lead"
            return [ScopedRateThrottle()]
        return super().get_throttles()

    def get_serializer_class(self):
        if self.action == "create":
            return LeadCreateSerializer
        return LeadAdminSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        lead = serializer.save()
        # Synchronous — no Celery/Redis broker to host. Telegram/email sends
        # are each individually wrapped in try/except (see tasks.py), so a
        # slow or failed notification can't break the lead submission itself.
        from .tasks import notify_new_lead
        notify_new_lead(lead.pk)
        return Response(
            {"detail": "Murojaatingiz qabul qilindi. Tez orada bog'lanamiz!"},
            status=status.HTTP_201_CREATED,
        )
