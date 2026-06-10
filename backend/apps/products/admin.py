from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from .models import ProductCategory, Product, ProductImage


class ProductImageInline(TabularInline):
    model = ProductImage
    extra = 1
    fields = ("image", "is_main", "order", "alt_uz", "alt_ru", "alt_en")


@admin.register(ProductCategory)
class ProductCategoryAdmin(ModelAdmin):
    list_display  = ("name_uz", "parent", "slug", "is_active", "order")
    list_editable = ("is_active", "order")
    list_filter   = ("is_active", "parent")
    search_fields = ("name_uz", "name_ru", "name_en")
    prepopulated_fields = {"slug": ("name_uz",)}

    fieldsets = (
        ("Asosiy ma'lumotlar", {
            "description": (
                "Kategoriya nomini 3 tilda kiriting. "
                "Slug — URL uchun ishlatiladi va Name uz asosida avtomatik to'ldiriladi, "
                "qo'lda o'zgartirmang."
            ),
            "fields": ("parent", "slug", "name_uz", "name_ru", "name_en"),
        }),
        ("Ko'rinish", {
            "description": (
                "Cover image — kategoriya sahifasida chiqadigan muqova rasm. "
                "Icon — ixtiyoriy, masalan 'fa-cogs' kabi icon nomi."
            ),
            "fields": ("cover_image", "icon"),
        }),
        ("Sozlamalar", {
            "description": (
                "Order — tartib raqami, kichik son yuqorida turadi. "
                "Is active — belgilanmasa kategoriya saytda ko'rinmaydi."
            ),
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
    inlines = [ProductImageInline]

    fieldsets = (
        ("Kategoriya & Slug", {
            "description": (
                "Mahsulot qaysi kategoriyaga tegishli ekanini tanlang. "
                "Slug — sayt URL manzili uchun (masalan: siemens-s7-1200). "
                "Name uz kiritilsa slug avtomatik to'ldiriladi — qo'lda o'zgartirmang."
            ),
            "fields": ("category", "slug"),
        }),
        ("Nomi", {
            "description": (
                "Mahsulot nomini 3 tilda kiriting. "
                "Faqat Name uz majburiy maydon — qolganlar ixtiyoriy."
            ),
            "fields": ("name_uz", "name_ru", "name_en"),
        }),
        ("Tavsif", {
            "description": (
                "Mahsulot haqida batafsil ma'lumot: qo'llanish sohalari, afzalliklari, texnik imkoniyatlari. "
                "Faqat o'zbekcha kiritilsa ham bo'ladi — sayt o'sha tilni ko'rsatadi."
            ),
            "fields": ("description_uz", "description_ru", "description_en"),
        }),
        ("Texnik xususiyatlar (specifications)", {
            "description": (
                "JSON formatda kiriting. Har bir qator — bir xususiyat. Namuna:\n"
                '[{"label_uz": "Quvvat manbai", "label_ru": "Питание", "label_en": "Power supply", "value": "24V DC"}, '
                '{"label_uz": "Himoya darajasi", "label_ru": "Степень защиты", "label_en": "Protection", "value": "IP67"}]'
            ),
            "fields": ("specifications",),
        }),
        ("Katalog fayli", {
            "description": (
                "Mahsulot katalogi yoki texnik pasportini PDF formatda yuklang. "
                "Foydalanuvchilar sahifadan yuklab olishi mumkin. Ixtiyoriy maydon."
            ),
            "fields": ("catalog_file",),
        }),
        ("Sozlamalar", {
            "description": (
                "Order — tartib raqami, kichik son yuqorida turadi (0, 1, 2...). "
                "Is active — belgilanmasa mahsulot saytda ko'rinmaydi."
            ),
            "fields": ("order", "is_active"),
        }),
    )
