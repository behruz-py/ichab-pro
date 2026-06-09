from rest_framework import serializers
from core.serializers import TranslatedSerializerMixin, ImageFieldAbsoluteURL, FileFieldAbsoluteURL
from .models import Certificate


class CertificateSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    issuing_organization = serializers.SerializerMethodField()
    image = ImageFieldAbsoluteURL(read_only=True)
    document = FileFieldAbsoluteURL(read_only=True)

    class Meta:
        model = Certificate
        fields = (
            "id", "name", "issuing_organization",
            "issued_date", "expiry_date",
            "image", "document",
            "is_international", "order", "is_active",
            "created_at", "updated_at",
        )

    def get_name(self, obj):
        return self.get_t(obj, "name")

    def get_issuing_organization(self, obj):
        return self.get_t(obj, "issuing_organization")


class CertificateWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        exclude = ("created_at", "updated_at")
