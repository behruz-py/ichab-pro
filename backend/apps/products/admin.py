from django.contrib import admin
from django.utils.html import mark_safe
from unfold.admin import ModelAdmin
from .models import ProductCategory, Product, ProductImage, ProductSpecification


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ("image", "is_main", "order", "alt_uz")
    verbose_name = "Rasm"
    verbose_name_plural = "Rasmlar (birinchisini 'Asosiy' deb belgilang)"


class ProductSpecificationInline(admin.TabularInline):
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
        ("Ko'p ustunli jadval (ixtiyoriy)", {
            "description": mark_safe(
                "<p>Bir nechta model/variant uchun qiymatlar jadvali. "
                "Birinchi qator — ustun sarlavhalari, qolganlar — ma'lumot qatorlari. "
                "Ustunlarni <code>|</code> (vertikal chiziq) bilan ajrating. "
                "<strong>Har bir qator ALOHIDA QATORDA bo'lishi SHART.</strong></p>"
                "<p>Quyidagi namunani to'liq nusxalab maydonga joylashtiring:</p>"
                "<pre style='background:#0f172a;color:#94a3b8;padding:12px 16px;"
                "font-size:11px;line-height:1.7;border-radius:6px;"
                "overflow-x:auto;white-space:pre;margin:4px 0 8px'>"
                "Наименование параметра | ВТЕ-200/48 | ВТЕ-315/48 | ВТЕ-315/75 | ВТЕ-315/115 | ВТЕ-315/150 | ВТЕ-315/230\n"
                "Номинальная мощность, кВА | 15,12 | - | 23,62 | 36,22 | 47,25 | 72,45\n"
                "Номинальный ток, А | 200 | - | - | 315 | - | -\n"
                "Номинальное напряжение, В | 48 | - | 75 | 115 | 150 | 230\n"
                "Кратность форсировки по напряжению, не менее | 1,75 / 2,5 | - | - | - | - | -\n"
                "Схема выпрямления | 3-х фазная мостовая | - | - | - | - | -\n"
                "Габариты (ВхШхГ), мм | 1450x650x430* | - | - | - | - | -\n"
                "Масса возбудителя, кг | 90-110 | - | - | - | 135-140 | -\n"
                "КПД, % | 91 | - | 92 | 94 | 94 | 96\n"
                "Коэффициент мощности | 0,88 | - | 0,88 | - | - | 0,92"
                "</pre>"
            ),
            "fields": ("spec_table",),
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
