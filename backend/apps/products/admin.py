from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from .models import ProductCategory, Product, ProductImage, ProductSpecification


class ProductImageInline(TabularInline):
    model = ProductImage
    extra = 1
    fields = ("image", "is_main", "order", "alt_uz")
    verbose_name = "Rasm"
    verbose_name_plural = "Rasmlar (birinchisini 'Asosiy' deb belgilang)"


class ProductSpecificationInline(TabularInline):
    model = ProductSpecification
    extra = 1
    fields = ("label_uz", "label_ru", "label_en", "value", "order")
    verbose_name = "Xususiyat"
    verbose_name_plural = "Texnik xususiyatlar (har bir qator — bitta ko'rsatkich)"


@admin.register(ProductCategory)
class ProductCategoryAdmin(ModelAdmin):
    list_display  = ("name_uz", "slug", "is_active", "order")
    list_editable = ("is_active", "order")
    list_filter   = ("is_active",)
    search_fields = ("name_uz", "name_ru", "name_en")
    prepopulated_fields = {"slug": ("name_uz",)}

    fieldsets = (
        ("Nomi", {
            "description": "Kategoriya nomini kiriting. Slug avtomatik to'ldiriladi — o'zgartirmang.",
            "fields": ("slug", "name_uz", "name_ru", "name_en"),
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
    list_display  = ("name_uz", "category", "is_active", "order", "created_at")
    list_editable = ("is_active", "order")
    list_filter   = ("is_active", "category")
    search_fields = ("name_uz", "name_ru", "name_en")
    prepopulated_fields = {"slug": ("name_uz",)}
    inlines = [ProductImageInline, ProductSpecificationInline]

    fieldsets = (
        ("Kategoriya & Slug", {
            "description": "Kategoriyani tanlang. Slug — URL manzili, Name uz yozilsa avtomatik to'ldiriladi.",
            "fields": ("category", "slug"),
        }),
        ("Nomi", {
            "description": "Faqat o'zbekcha majburiy. Qolganlar ixtiyoriy.",
            "fields": ("name_uz", "name_ru", "name_en"),
        }),
        ("Tavsif", {
            "description": "Mahsulot haqida batafsil matn. Qo'llanish sohalari, afzalliklari.",
            "fields": ("description_uz", "description_ru", "description_en"),
        }),
        ("Katalog fayli", {
            "description": "PDF katalog yoki texnik pasport. Foydalanuvchilar yuklab oladi. Ixtiyoriy.",
            "fields": ("catalog_file",),
        }),
        ("Sozlamalar", {
            "description": "Order: kichik son = yuqorida (0, 1, 2...). Is active: belgilanmasa ko'rinmaydi.",
            "fields": ("order", "is_active"),
        }),
    )
