from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Service, ServiceImage


class ServiceImageInline(admin.TabularInline):
    model = ServiceImage
    extra = 1
    fields = ("image", "is_main", "order")


@admin.register(Service)
class ServiceAdmin(ModelAdmin):
    list_display = ("name_uz", "division", "is_active", "order")
    list_editable = ("is_active", "order")
    list_filter = ("is_active", "division")
    search_fields = ("name_uz", "name_ru", "name_en")
    prepopulated_fields = {"slug": ("name_uz",)}
    inlines = [ServiceImageInline]
    fieldsets = (
        ("Bo'linma", {
            "description": "Qaysi laboratoriya/bo'linmaga tegishli. Bo'sh qoldirilsa umumiy xizmat sifatida ko'rinadi.",
            "fields": ("division", "slug"),
        }),
        ("Nomi (UZ | RU | EN)", {"fields": ("name_uz", "name_ru", "name_en")}),
        ("Qisqa tavsif", {"fields": ("short_description_uz", "short_description_ru", "short_description_en")}),
        ("To'liq tavsif", {"fields": ("description_uz", "description_ru", "description_en")}),
        ("Nega muhim / xususiyatlari", {
            "description": "Har qatorga bitta band yozing — laboratoriya sahifasida ✔ belgili ro'yxat sifatida chiqadi. Masalan:\nNosozlikni oldindan aniqlaydi\nIshlab chiqarish to'xtashini kamaytiradi",
            "fields": ("highlights_uz", "highlights_ru", "highlights_en"),
        }),
        ("Ko'rinish", {"fields": ("icon", "cover_image")}),
        ("Narx", {"fields": ("price_from",)}),
        ("Sozlamalar", {"fields": ("order", "is_active")}),
    )
