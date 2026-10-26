from rest_framework import serializers
from core.serializers import TranslatedSerializerMixin, ImageFieldAbsoluteURL, translate_plain
from .models import Service, ServiceImage


def parse_highlights(text: str) -> list[str]:
    """One bullet per line -> list, blank lines dropped."""
    return [line.strip() for line in text.splitlines() if line.strip()]


class ServiceImageSerializer(serializers.ModelSerializer):
    image = ImageFieldAbsoluteURL(read_only=True)

    class Meta:
        model = ServiceImage
        fields = ("id", "image", "is_main", "order")


class ServiceListSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()
    division_name = serializers.SerializerMethodField()
    highlights = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = (
            "id", "slug", "name", "short_description", "icon",
            "cover_image", "division", "division_name", "highlights",
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

    def get_highlights(self, obj):
        return parse_highlights(translate_plain(obj, "highlights", self._lang()))

    def get_cover_image(self, obj):
        # Admins often upload only to the gallery; the list's cover then falls
        # back to the main (else first) gallery image. `images` is prefetched
        # and already ordered main-first, so this adds no queries.
        image = obj.cover_image or next((i.image for i in obj.images.all() if i.image), None)
        if not image:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(image.url) if request else image.url


class ServiceDetailSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    highlights = serializers.SerializerMethodField()
    cover_image = ImageFieldAbsoluteURL(read_only=True)
    images = ServiceImageSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = (
            "id", "slug", "name", "short_description", "description", "highlights",
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

    def get_highlights(self, obj):
        return parse_highlights(translate_plain(obj, "highlights", self._lang()))


class ServiceWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        exclude = ("created_at", "updated_at")
