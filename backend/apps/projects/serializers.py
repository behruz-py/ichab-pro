from rest_framework import serializers
from core.serializers import TranslatedSerializerMixin, ImageFieldAbsoluteURL
from .models import Project, ProjectImage


class ProjectImageSerializer(serializers.ModelSerializer):
    image = ImageFieldAbsoluteURL(read_only=True)

    class Meta:
        model = ProjectImage
        fields = ("id", "image", "caption_uz", "caption_ru", "caption_en", "is_main", "order")


class ProjectListSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    client = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            "id", "slug", "name", "client", "location",
            "completed_date", "division", "main_image",
            "order", "is_active",
        )

    def get_name(self, obj):
        return self.get_t(obj, "name")

    def get_client(self, obj):
        return self.get_t(obj, "client")

    def get_location(self, obj):
        return self.get_t(obj, "location")

    def get_main_image(self, obj):
        img = obj.images.filter(is_main=True).first() or obj.images.first()
        if img:
            request = self.context.get("request")
            return request.build_absolute_uri(img.image.url) if request else img.image.url
        return None


class ProjectDetailSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    client = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    result = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    images = ProjectImageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = (
            "id", "slug", "name", "client", "description", "result", "location",
            "completed_date", "division", "images",
            "order", "is_active", "created_at", "updated_at",
        )

    def get_name(self, obj):
        return self.get_t(obj, "name")

    def get_client(self, obj):
        return self.get_t(obj, "client")

    def get_description(self, obj):
        return self.get_t(obj, "description")

    def get_result(self, obj):
        return self.get_t(obj, "result")

    def get_location(self, obj):
        return self.get_t(obj, "location")


class ProjectWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        exclude = ("created_at", "updated_at")
