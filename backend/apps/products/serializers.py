from rest_framework import serializers
from core.serializers import (
    TranslatedSerializerMixin, ImageFieldAbsoluteURL, FileFieldAbsoluteURL,
    translate_plain,
)
from .models import ProductCategory, Product, ProductImage, ProductSpecification


class ProductImageSerializer(serializers.ModelSerializer):
    image = ImageFieldAbsoluteURL(read_only=True)
    alt = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ("id", "image", "alt", "alt_uz", "alt_ru", "alt_en", "is_main", "order")

    def get_alt(self, obj):
        request = self.context.get("request")
        lang = request.query_params.get("lang", "uz") if request else "uz"
        return translate_plain(obj, "alt", lang)


class ProductSpecificationSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()

    class Meta:
        model = ProductSpecification
        fields = ("id", "label", "value", "unit", "order")

    def get_label(self, obj):
        request = self.context.get("request")
        lang = request.query_params.get("lang", "uz") if request else "uz"
        return translate_plain(obj, "label", lang)


class ProductCategoryListSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    cover_image = ImageFieldAbsoluteURL(read_only=True)

    class Meta:
        model = ProductCategory
        fields = ("id", "slug", "name", "icon", "cover_image", "parent", "order")

    def get_name(self, obj):
        return self.get_t(obj, "name")


class ProductCategoryWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        exclude = ("created_at", "updated_at")


class ProductListSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id", "slug", "name", "short_description", "sku", "brand", "availability",
            "category", "category_name", "main_image", "order", "is_active",
        )

    def get_name(self, obj):
        return self.get_t(obj, "name")

    def get_short_description(self, obj):
        return self.get_t(obj, "short_description")

    def get_category_name(self, obj):
        if obj.category:
            return obj.category.translate("name", self._lang())
        return None

    def get_main_image(self, obj):
        imgs = list(obj.images.all())  # prefetch_related cache — no extra query
        img = next((i for i in imgs if i.is_main), imgs[0] if imgs else None)
        if not img:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(img.image.url) if request else img.image.url


class ProductDetailSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    meta_title = serializers.SerializerMethodField()
    meta_description = serializers.SerializerMethodField()
    category = ProductCategoryListSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    specs = ProductSpecificationSerializer(many=True, read_only=True)
    variant_table = serializers.SerializerMethodField()
    catalog_file = FileFieldAbsoluteURL(read_only=True)

    class Meta:
        model = Product
        fields = (
            "id", "slug", "name", "short_description", "description",
            "sku", "brand", "availability",
            "meta_title", "meta_description",
            "category", "specs", "variant_table", "images", "catalog_file",
            "order", "is_active",
        )

    def get_name(self, obj):
        return self.get_t(obj, "name")

    def get_short_description(self, obj):
        return self.get_t(obj, "short_description")

    def get_description(self, obj):
        return self.get_t(obj, "description")

    def get_meta_title(self, obj):
        return self.get_t(obj, "meta_title") or self.get_t(obj, "name")

    def get_meta_description(self, obj):
        return self.get_t(obj, "meta_description") or self.get_t(obj, "short_description")

    def get_variant_table(self, obj):
        """Build the multi-column comparison table from the normalized
        ProductParameter (rows) / ProductVariant (columns) / values (cells)."""
        variants = list(obj.variants.all())
        parameters = list(obj.parameters.all())
        if not variants or not parameters:
            return None

        lang = self._lang()
        value_map = {}
        for v in variants:
            for vv in v.values.all():
                value_map[(vv.parameter_id, v.id)] = vv.value

        rows = []
        for p in parameters:
            rows.append({
                "label": translate_plain(p, "label", lang),
                "unit": p.unit,
                "values": [value_map.get((p.id, v.id), "") for v in variants],
            })

        return {
            "variants": [v.code for v in variants],
            "rows": rows,
        }


class ProductWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        exclude = ("created_at", "updated_at")
