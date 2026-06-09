from rest_framework import serializers
from core.serializers import TranslatedSerializerMixin, ImageFieldAbsoluteURL
from .models import PageContent


class PageContentSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    subtitle = serializers.SerializerMethodField()
    body = serializers.SerializerMethodField()
    image = ImageFieldAbsoluteURL(read_only=True)

    class Meta:
        model = PageContent
        fields = (
            "id", "key", "title", "subtitle", "body",
            "image", "meta", "order", "is_active",
        )

    def get_title(self, obj):
        return self.get_t(obj, "title")

    def get_subtitle(self, obj):
        return self.get_t(obj, "subtitle")

    def get_body(self, obj):
        return self.get_t(obj, "body")


class PageContentWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageContent
        exclude = ("created_at", "updated_at")
