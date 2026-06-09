from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import PageContent


@admin.register(PageContent)
class PageContentAdmin(ModelAdmin):
    list_display = ("key", "title_uz", "is_active", "order")
    list_editable = ("is_active", "order")
    list_filter = ("is_active",)
    search_fields = ("key", "title_uz", "title_ru", "title_en")
    fieldsets = (
        ("Kalit", {"fields": ("key",)}),
        ("Sarlavha", {"fields": ("title_uz", "title_ru", "title_en")}),
        ("Kichik sarlavha", {"fields": ("subtitle_uz", "subtitle_ru", "subtitle_en")}),
        ("Matn", {"fields": ("body_uz", "body_ru", "body_en")}),
        ("Media & Meta", {"fields": ("image", "meta")}),
        ("Sozlamalar", {"fields": ("order", "is_active")}),
    )
