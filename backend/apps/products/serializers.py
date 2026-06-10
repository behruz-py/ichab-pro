from rest_framework import serializers
from core.serializers import TranslatedSerializerMixin, ImageFieldAbsoluteURL, FileFieldAbsoluteURL
from .models import ProductCategory, Product, ProductImage, ProductSpecification


class ProductImageSerializer(serializers.ModelSerializer):
    image = ImageFieldAbsoluteURL(read_only=True)

    class Meta:
        model = ProductImage
        fields = ("id", "image", "alt_uz", "alt_ru", "alt_en", "is_main", "order")


class ProductSpecificationSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()

    class Meta:
        model = ProductSpecification
        fields = ("id", "label", "value", "order")

    def get_label(self, obj):
        request = self.context.get("request")
        lang = "uz"
        if request:
            candidate = request.query_params.get("lang", "uz")
            if candidate in ("uz", "ru", "en"):
                lang = candidate
        return getattr(obj, f"label_{lang}", None) or obj.label_uz or ""


class ProductCategoryListSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    cover_image = ImageFieldAbsoluteURL(read_only=True)

    class Meta:
        model = ProductCategory
        fields = ("id", "slug", "name", "icon", "cover_image", "order")

    def get_name(self, obj):
        return self.get_t(obj, "name")


class ProductCategoryWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        exclude = ("created_at", "updated_at")


class ProductListSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id", "slug", "name", "category", "category_name",
            "main_image", "order", "is_active",
        )

    def get_name(self, obj):
        return self.get_t(obj, "name")

    def get_category_name(self, obj):
        if obj.category:
            return obj.category.translate("name", self._lang())
        return None

    def get_main_image(self, obj):
        imgs = list(obj.images.all())  # uses prefetch_related cache — no extra query
        img = next((i for i in imgs if i.is_main), imgs[0] if imgs else None)
        if not img:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(img.image.url) if request else img.image.url


class ProductDetailSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    category = ProductCategoryListSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    specs = ProductSpecificationSerializer(many=True, read_only=True)
    catalog_file = FileFieldAbsoluteURL(read_only=True)

    class Meta:
        model = Product
        fields = (
            "id", "slug", "name", "description", "category",
            "specs", "spec_table", "images", "catalog_file",
            "order", "is_active",
        )

    def get_name(self, obj):
        return self.get_t(obj, "name")

    def get_description(self, obj):
        return self.get_t(obj, "description")


class ProductWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        exclude = ("created_at", "updated_at", "specifications")
