from django.contrib import admin
from .models import Division


@admin.register(Division)
class DivisionAdmin(admin.ModelAdmin):
    list_display = ("name_uz", "slug", "is_active", "order", "created_at")
    list_editable = ("is_active", "order")
    list_filter = ("is_active",)
    search_fields = ("name_uz", "name_ru", "name_en")
    prepopulated_fields = {"slug": ("name_uz",)}
    fieldsets = (
        ("Slug", {"fields": ("slug",)}),
        ("Nomi (UZ | RU | EN)", {"fields": ("name_uz", "name_ru", "name_en")}),
        ("Qisqa tavsif", {"fields": ("short_description_uz", "short_description_ru", "short_description_en")}),
        ("To'liq tavsif", {"fields": ("full_description_uz", "full_description_ru", "full_description_en")}),
        ("Rahbar", {"fields": ("leader_name_uz", "leader_name_ru", "leader_name_en",
                               "leader_position_uz", "leader_position_ru", "leader_position_en")}),
        ("Media", {"fields": ("logo", "cover_image")}),
        ("Kontakt", {"fields": ("contact_phone", "contact_email")}),
        ("Sozlamalar", {"fields": ("order", "is_active")}),
    )
