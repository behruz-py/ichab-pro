from rest_framework import serializers
from core.serializers import TranslatedSerializerMixin, ImageFieldAbsoluteURL
from .models import Division


class DivisionListSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    leader_name = serializers.SerializerMethodField()
    logo = ImageFieldAbsoluteURL(read_only=True)
    cover_image = ImageFieldAbsoluteURL(read_only=True)

    class Meta:
        model = Division
        fields = (
            "id", "slug", "name", "short_description",
            "logo", "cover_image", "leader_name",
            "order", "is_active",
        )

    def get_name(self, obj):
        return self.get_t(obj, "name")

    def get_short_description(self, obj):
        return self.get_t(obj, "short_description")

    def get_leader_name(self, obj):
        return self.get_t(obj, "leader_name")


class DivisionDetailSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    full_description = serializers.SerializerMethodField()
    leader_name = serializers.SerializerMethodField()
    leader_position = serializers.SerializerMethodField()
    logo = ImageFieldAbsoluteURL(read_only=True)
    cover_image = ImageFieldAbsoluteURL(read_only=True)

    class Meta:
        model = Division
        fields = (
            "id", "slug", "name", "short_description", "full_description",
            "logo", "cover_image",
            "leader_name", "leader_position",
            "contact_phone", "contact_email",
            "order", "is_active", "created_at", "updated_at",
        )

    def get_name(self, obj):
        return self.get_t(obj, "name")

    def get_short_description(self, obj):
        return self.get_t(obj, "short_description")

    def get_full_description(self, obj):
        return self.get_t(obj, "full_description")

    def get_leader_name(self, obj):
        return self.get_t(obj, "leader_name")

    def get_leader_position(self, obj):
        return self.get_t(obj, "leader_position")


class DivisionWriteSerializer(serializers.ModelSerializer):
    """Used for create/update — accepts all raw multilingual fields."""

    class Meta:
        model = Division
        exclude = ("created_at", "updated_at")
