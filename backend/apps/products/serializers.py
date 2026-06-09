from rest_framework import serializers
from core.serializers import TranslatedSerializerMixin, ImageFieldAbsoluteURL, FileFieldAbsoluteURL
from .models import ProductCategory, Product, ProductImage


class ProductImageSerializer(serializers.ModelSerializer):
    image = ImageFieldAbsoluteURL(read_only=True)

    class Meta:
        model = ProductImage
        fields = ("id", "image", "alt_uz", "alt_ru", "alt_en", "is_main", "order")


class ProductCategoryListSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    cover_image = ImageFieldAbsoluteURL(read_only=True)
    children_count = serializers.IntegerField(source="children.count", read_only=True)

    class Meta:
        model = ProductCategory
        fields = ("id", "slug", "name", "icon", "cover_image", "parent", "children_count", "order")

    def get_name(self, obj):
        return self.get_t(obj, "name")


class ProductCategoryDetailSerializer(ProductCategoryListSerializer):
    children = serializers.SerializerMethodField()

    class Meta(ProductCategoryListSerializer.Meta):
        fields = ProductCategoryListSerializer.Meta.fields + ("children",)

    def get_children(self, obj):
        qs = obj.children.filter(is_active=True).order_by("order")
        return ProductCategoryListSerializer(qs, many=True, context=self.context).data


class ProductCategoryWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        exclude = ("created_at", "updated_at")


class ProductListSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id", "slug", "name", "description", "category", "category_name",
            "main_image", "order", "is_active",
        )

    def get_name(self, obj):
        return self.get_t(obj, "name")

    def get_description(self, obj):
        return self.get_t(obj, "description")

    def get_category_name(self, obj):
        if obj.category:
            return obj.category.translate("name", self._lang())
        return None

    def get_main_image(self, obj):
        img = obj.images.filter(is_main=True).first() or obj.images.first()
        if img:
            request = self.context.get("request")
            url = img.image.url
            return request.build_absolute_uri(url) if request else url
        return None


class ProductDetailSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    category = ProductCategoryListSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    catalog_file = FileFieldAbsoluteURL(read_only=True)

    class Meta:
        model = Product
        fields = (
            "id", "slug", "name", "description", "category",
            "specifications", "images", "catalog_file",
            "order", "is_active", "created_at", "updated_at",
        )

    def get_name(self, obj):
        return self.get_t(obj, "name")

    def get_description(self, obj):
        return self.get_t(obj, "description")


class ProductWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        exclude = ("created_at", "updated_at")
