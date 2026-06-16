from django.contrib import admin
from django.urls import path, reverse
from django.shortcuts import redirect, get_object_or_404
from django.template.response import TemplateResponse
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.contrib import messages
from unfold.admin import ModelAdmin
from .models import (
    ProductCategory, Product, ProductImage, ProductSpecification,
    ProductParameter, ProductVariant, ProductVariantValue,
)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ("image", "is_main", "order", "alt_uz")
    verbose_name = "Rasm"
    verbose_name_plural = "Rasmlar (birinchisini 'Asosiy' deb belgilang)"


class ProductSpecificationInline(admin.TabularInline):
    model = ProductSpecification
    extra = 1
    fields = ("label_uz", "label_ru", "label_en", "value", "unit", "order")
    verbose_name = "Xususiyat"
    verbose_name_plural = "Oddiy texnik xususiyatlar (variantsiz — har qator bitta ko'rsatkich)"


class ProductParameterInline(admin.TabularInline):
    model = ProductParameter
    extra = 1
    fields = ("label_uz", "label_ru", "label_en", "unit", "order")
    verbose_name = "Jadval qatori (parametr)"
    verbose_name_plural = "① Ko'p ustunli jadval — QATORLAR (parametrlar)"


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    fields = ("code", "order")
    verbose_name = "Jadval ustuni (variant)"
    verbose_name_plural = "② Ko'p ustunli jadval — USTUNLAR (variantlar)"


@admin.register(ProductCategory)
class ProductCategoryAdmin(ModelAdmin):
    list_display  = ("name_uz", "slug", "parent", "is_active", "order")
    list_editable = ("is_active", "order")
    list_filter   = ("is_active", "parent")
    search_fields = ("name_uz", "name_ru", "name_en")
    prepopulated_fields = {"slug": ("name_uz",)}

    fieldsets = (
        ("Nomi", {
            "description": "Kategoriya nomini kiriting. Slug avtomatik to'ldiriladi — o'zgartirmang.",
            "fields": ("slug", "name_uz", "name_ru", "name_en"),
        }),
        ("Ierarxiya", {
            "description": "Ichki kategoriya bo'lsa, asosiy kategoriyani tanlang. Bosh kategoriya bo'lsa bo'sh qoldiring.",
            "fields": ("parent",),
        }),
        ("Ko'rinish", {
            "description": "Muqova rasm ixtiyoriy. Icon — 'fa-cogs' yoki emoji '⚙️' ko'rinishida.",
            "fields": ("cover_image", "icon"),
        }),
        ("Sozlamalar", {
            "description": "Order: kichik son = yuqorida turadi (0, 1, 2...). Is active: belgilanmasa ko'rinmaydi.",
            "fields": ("order", "is_active"),
        }),
    )


@admin.register(Product)
class ProductAdmin(ModelAdmin):
    list_display  = ("name_uz", "sku", "category", "availability", "is_active", "order")
    list_editable = ("is_active", "order")
    list_filter   = ("is_active", "availability", "category")
    search_fields = ("name_uz", "name_ru", "name_en", "sku", "brand")
    prepopulated_fields = {"slug": ("name_uz",)}
    inlines = [
        ProductImageInline, ProductSpecificationInline,
        ProductParameterInline, ProductVariantInline,
    ]
    readonly_fields = ("variant_matrix_link",)

    fieldsets = (
        ("Asosiy", {
            "description": "Kategoriyani tanlang. Slug — URL manzili, Name uz yozilsa avtomatik to'ldiriladi.",
            "fields": ("category", "slug", "sku", "brand", "availability"),
        }),
        ("Nomi", {
            "description": "Faqat o'zbekcha majburiy. Rus va ingliz tillarini ham to'ldirish tavsiya etiladi.",
            "fields": ("name_uz", "name_ru", "name_en"),
        }),
        ("Qisqa tavsif", {
            "description": "Kartalar va qidiruv natijalarida ko'rinadigan 1-2 jumla.",
            "fields": ("short_description_uz", "short_description_ru", "short_description_en"),
        }),
        ("To'liq tavsif", {
            "description": "Mahsulot haqida batafsil matn. Qo'llanish sohalari, afzalliklari.",
            "fields": ("description_uz", "description_ru", "description_en"),
        }),
        ("Ko'p ustunli jadval (qiymatlar)", {
            "description": mark_safe(
                "Avval pastdagi ① QATORLAR va ② USTUNLAR bo'limlarini to'ldiring va "
                "<b>Saqlash</b>ni bosing. Keyin shu yerdagi tugma orqali jadval kataklarini to'ldiring."
            ),
            "fields": ("variant_matrix_link",),
        }),
        ("Katalog fayli", {
            "description": "PDF katalog yoki texnik pasport. Foydalanuvchilar yuklab oladi. Ixtiyoriy.",
            "fields": ("catalog_file",),
        }),
        ("SEO (qidiruv tizimlari)", {
            "classes": ("collapse",),
            "description": "Ixtiyoriy. Bo'sh qoldirilsa mahsulot nomi va qisqa tavsifi avtomatik ishlatiladi.",
            "fields": (
                "meta_title_uz", "meta_title_ru", "meta_title_en",
                "meta_description_uz", "meta_description_ru", "meta_description_en",
            ),
        }),
        ("Sozlamalar", {
            "description": "Order: kichik son = yuqorida (0, 1, 2...). Is active: belgilanmasa ko'rinmaydi.",
            "fields": ("order", "is_active"),
        }),
    )

    # ─── Variant matrix editor ──────────────────────────────────────────────
    @admin.display(description="Jadval kataklari")
    def variant_matrix_link(self, obj):
        if not obj or not obj.pk:
            return "Avval mahsulotni saqlang, keyin bu yerda jadval tahrirlovchisi paydo bo'ladi."
        n_params = obj.parameters.count()
        n_variants = obj.variants.count()
        if not n_params or not n_variants:
            return "① Kamida bitta QATOR (parametr) va ② bitta USTUN (variant) qo'shib, saqlang."
        url = reverse("admin:products_product_matrix", args=[obj.pk])
        return format_html(
            '<a href="{}" class="button" style="display:inline-block;padding:8px 18px;'
            'background:#3B82F6;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">'
            '✎ Jadval kataklarini to\'ldirish ({}×{})</a>',
            url, n_params, n_variants,
        )

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path(
                "<path:object_id>/matrix/",
                self.admin_site.admin_view(self.matrix_view),
                name="products_product_matrix",
            ),
        ]
        return custom + urls

    def matrix_view(self, request, object_id):
        product = get_object_or_404(Product, pk=object_id)
        parameters = list(product.parameters.all().order_by("order"))
        variants = list(product.variants.all().order_by("order"))

        if request.method == "POST":
            existing = {
                (vv.parameter_id, vv.variant_id): vv
                for vv in ProductVariantValue.objects.filter(variant__product=product)
            }
            for p in parameters:
                for v in variants:
                    key = f"cell_{p.id}_{v.id}"
                    value = request.POST.get(key, "").strip()
                    obj = existing.get((p.id, v.id))
                    if obj:
                        if obj.value != value:
                            obj.value = value
                            obj.save(update_fields=["value"])
                    elif value:
                        ProductVariantValue.objects.create(parameter=p, variant=v, value=value)
            messages.success(request, "Jadval qiymatlari saqlandi.")
            return redirect(reverse("admin:products_product_change", args=[product.pk]))

        value_map = {
            (vv.parameter_id, vv.variant_id): vv.value
            for vv in ProductVariantValue.objects.filter(variant__product=product)
        }
        rows = []
        for p in parameters:
            cells = [
                {"name": f"cell_{p.id}_{v.id}", "value": value_map.get((p.id, v.id), "")}
                for v in variants
            ]
            rows.append({"param": p, "cells": cells})

        context = {
            **self.admin_site.each_context(request),
            "title": f"Jadval kataklari — {product}",
            "product": product,
            "variants": variants,
            "rows": rows,
            "back_url": reverse("admin:products_product_change", args=[product.pk]),
            "opts": self.model._meta,
        }
        return TemplateResponse(request, "admin/products/variant_matrix.html", context)


@admin.register(ProductVariant)
class ProductVariantAdmin(ModelAdmin):
    list_display = ("code", "product", "order")
    list_filter = ("product",)
    search_fields = ("code", "product__name_uz")
