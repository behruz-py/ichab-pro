from rest_framework import serializers
from core.serializers import TranslatedSerializerMixin, ImageFieldAbsoluteURL
from .models import Service, ServiceImage


class ServiceImageSerializer(serializers.ModelSerializer):
    image = ImageFieldAbsoluteURL(read_only=True)

    class Meta:
        model = ServiceImage
        fields = ("id", "image", "is_main", "order")


class ServiceListSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    cover_image = ImageFieldAbsoluteURL(read_only=True)
    division_name = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = (
            "id", "slug", "name", "short_description", "icon",
            "cover_image", "division", "division_name",
            "price_from", "order", "is_active",
        )

    def get_name(self, obj):
        return self.get_t(obj, "name")

    def get_short_description(self, obj):
        return self.get_t(obj, "short_description")

    def get_division_name(self, obj):
        if obj.division:
            return obj.division.translate("name", self._lang())
        return None


class ServiceDetailSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    cover_image = ImageFieldAbsoluteURL(read_only=True)
    images = ServiceImageSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = (
            "id", "slug", "name", "short_description", "description",
            "icon", "cover_image", "images",
            "division", "price_from",
            "order", "is_active", "created_at", "updated_at",
        )

    def get_name(self, obj):
        return self.get_t(obj, "name")

    def get_short_description(self, obj):
        return self.get_t(obj, "short_description")

    def get_description(self, obj):
        return self.get_t(obj, "description")


class ServiceWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        exclude = ("created_at", "updated_at")
