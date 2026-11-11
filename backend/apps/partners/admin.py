from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Partner


@admin.register(Partner)
class PartnerAdmin(ModelAdmin):
    list_display = ("name_uz", "kind", "country_uz", "website", "is_featured", "is_active", "order")
    list_editable = ("kind", "is_featured", "is_active", "order")
    list_filter = ("kind", "is_active", "is_featured")
    search_fields = ("name_uz", "name_ru", "name_en")
