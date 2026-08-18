from rest_framework import serializers
from core.serializers import TranslatedSerializerMixin, ImageFieldAbsoluteURL, translate_plain
from apps.projects.serializers import ProjectListSerializer
from .models import (
    Division, DivisionStat, DivisionCapability, DivisionEquipment,
    DivisionImage, DivisionStandard, DivisionTeamMember,
)


class DivisionStatSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()

    class Meta:
        model = DivisionStat
        fields = ("id", "icon", "value", "suffix", "label", "order")

    def get_label(self, obj):
        request = self.context.get("request")
        lang = request.query_params.get("lang", "uz") if request else "uz"
        return translate_plain(obj, "label", lang)


class DivisionCapabilitySerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()

    class Meta:
        model = DivisionCapability
        fields = ("id", "icon", "title", "order")

    def get_title(self, obj):
        request = self.context.get("request")
        lang = request.query_params.get("lang", "uz") if request else "uz"
        return translate_plain(obj, "title", lang)


class DivisionEquipmentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    image = ImageFieldAbsoluteURL(read_only=True)

    class Meta:
        model = DivisionEquipment
        fields = ("id", "icon", "image", "name", "model_name", "order")

    def get_name(self, obj):
        request = self.context.get("request")
        lang = request.query_params.get("lang", "uz") if request else "uz"
        return translate_plain(obj, "name", lang)


class DivisionImageSerializer(serializers.ModelSerializer):
    image = ImageFieldAbsoluteURL(read_only=True)
    caption = serializers.SerializerMethodField()

    class Meta:
        model = DivisionImage
        fields = ("id", "image", "caption", "order")

    def get_caption(self, obj):
        request = self.context.get("request")
        lang = request.query_params.get("lang", "uz") if request else "uz"
        return translate_plain(obj, "caption", lang)


class DivisionStandardSerializer(serializers.ModelSerializer):
    class Meta:
        model = DivisionStandard
        fields = ("id", "name", "order")


class DivisionTeamMemberSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    position = serializers.SerializerMethodField()
    photo = ImageFieldAbsoluteURL(read_only=True)

    class Meta:
        model = DivisionTeamMember
        fields = ("id", "photo", "name", "position", "order")

    def get_name(self, obj):
        request = self.context.get("request")
        lang = request.query_params.get("lang", "uz") if request else "uz"
        return translate_plain(obj, "name", lang)

    def get_position(self, obj):
        request = self.context.get("request")
        lang = request.query_params.get("lang", "uz") if request else "uz"
        return translate_plain(obj, "position", lang)


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
    leader_photo = ImageFieldAbsoluteURL(read_only=True)
    logo = ImageFieldAbsoluteURL(read_only=True)
    cover_image = ImageFieldAbsoluteURL(read_only=True)
    stats = DivisionStatSerializer(many=True, read_only=True)
    capabilities = DivisionCapabilitySerializer(many=True, read_only=True)
    equipment = DivisionEquipmentSerializer(many=True, read_only=True)
    gallery = DivisionImageSerializer(many=True, read_only=True)
    standards = DivisionStandardSerializer(many=True, read_only=True)
    team_members = DivisionTeamMemberSerializer(many=True, read_only=True)
    related_projects = serializers.SerializerMethodField()

    class Meta:
        model = Division
        fields = (
            "id", "slug", "name", "short_description", "full_description",
            "logo", "cover_image",
            "leader_name", "leader_position", "leader_photo",
            "contact_phone", "contact_email",
            "stats", "capabilities", "equipment", "gallery", "standards",
            "team_members", "related_projects",
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

    def get_related_projects(self, obj):
        projects = [p for p in obj.projects.all() if p.is_active]
        return ProjectListSerializer(projects, many=True, context=self.context).data


class DivisionWriteSerializer(serializers.ModelSerializer):
    """Used for create/update — accepts all raw multilingual fields."""

    class Meta:
        model = Division
        exclude = ("created_at", "updated_at")
