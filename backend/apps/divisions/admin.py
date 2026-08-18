from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from .models import (
    Division, DivisionStat, DivisionCapability, DivisionEquipment,
    DivisionImage, DivisionStandard, DivisionTeamMember,
)


class DivisionStatInline(TabularInline):
    model = DivisionStat
    extra = 1
    fields = ("icon", "value", "suffix", "label_uz", "label_ru", "label_en", "order")
    verbose_name = "Ko'rsatkich"
    verbose_name_plural = "① Statistika (masalan: '15+ yillik tajriba')"


class DivisionCapabilityInline(TabularInline):
    model = DivisionCapability
    extra = 1
    fields = ("icon", "title_uz", "title_ru", "title_en", "order")
    verbose_name = "Imkoniyat"
    verbose_name_plural = "② Imkoniyatlar va xizmatlar"


class DivisionEquipmentInline(TabularInline):
    model = DivisionEquipment
    extra = 1
    fields = ("icon", "image", "name_uz", "name_ru", "name_en", "model_name", "order")
    verbose_name = "Jihoz"
    verbose_name_plural = "③ Jihozlar (rasm ixtiyoriy — bo'lmasa ikonka ko'rsatiladi)"


class DivisionImageInline(TabularInline):
    model = DivisionImage
    extra = 1
    fields = ("image", "caption_uz", "caption_ru", "caption_en", "order")
    verbose_name = "Rasm"
    verbose_name_plural = "④ Galereya"


class DivisionStandardInline(TabularInline):
    model = DivisionStandard
    extra = 1
    fields = ("name", "order")
    verbose_name = "Standart"
    verbose_name_plural = "⑤ Standartlar va sertifikatlar"


class DivisionTeamMemberInline(TabularInline):
    model = DivisionTeamMember
    extra = 1
    fields = ("photo", "name_uz", "name_ru", "name_en", "position_uz", "position_ru", "position_en", "order")
    verbose_name = "A'zo"
    verbose_name_plural = "⑥ Jamoa (rahbardan tashqari qo'shimcha a'zolar)"


@admin.register(Division)
class DivisionAdmin(ModelAdmin):
    list_display = ("name_uz", "slug", "is_active", "order", "created_at")
    list_editable = ("is_active", "order")
    list_filter = ("is_active",)
    search_fields = ("name_uz", "name_ru", "name_en")
    prepopulated_fields = {"slug": ("name_uz",)}
    inlines = [
        DivisionStatInline, DivisionCapabilityInline, DivisionEquipmentInline,
        DivisionImageInline, DivisionStandardInline, DivisionTeamMemberInline,
    ]
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
