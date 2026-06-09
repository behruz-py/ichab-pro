from rest_framework import serializers
from core.serializers import TranslatedSerializerMixin, ImageFieldAbsoluteURL
from .models import Partner


class PartnerSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    logo = ImageFieldAbsoluteURL(read_only=True)

    class Meta:
        model = Partner
        fields = (
            "id", "name", "description", "logo", "website",
            "is_featured", "order", "is_active",
        )

    def get_name(self, obj):
        return self.get_t(obj, "name")

    def get_description(self, obj):
        return self.get_t(obj, "description")


class PartnerWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        exclude = ("created_at", "updated_at")
