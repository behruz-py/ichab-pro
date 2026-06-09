from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Partner


@admin.register(Partner)
class PartnerAdmin(ModelAdmin):
    list_display = ("name_uz", "website", "is_featured", "is_active", "order")
    list_editable = ("is_featured", "is_active", "order")
    list_filter = ("is_active", "is_featured")
    search_fields = ("name_uz", "name_ru", "name_en")
