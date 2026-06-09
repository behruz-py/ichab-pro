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
