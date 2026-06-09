from rest_framework import serializers
from .models import Lead


class LeadCreateSerializer(serializers.ModelSerializer):
    """Public-facing: only fields the user fills in the contact form."""

    class Meta:
        model = Lead
        fields = ("name", "company", "phone", "email", "message", "subject", "source_page")

    def validate(self, data):
        if not data.get("phone") and not data.get("email"):
            raise serializers.ValidationError(
                "Telefon raqam yoki email kiritish shart."
            )
        return data


class LeadAdminSerializer(serializers.ModelSerializer):
    """Admin panel: full read + status update."""
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Lead
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at")
