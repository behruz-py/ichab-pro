from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Project, ProjectImage


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = ("image", "is_main", "order", "caption_uz")


@admin.register(Project)
class ProjectAdmin(ModelAdmin):
    list_display = ("name_uz", "client_uz", "division", "completed_date", "is_active", "order")
    list_editable = ("is_active", "order")
    list_filter = ("is_active", "division")
    search_fields = ("name_uz", "name_ru", "name_en", "client_uz")
    prepopulated_fields = {"slug": ("name_uz",)}
    inlines = [ProjectImageInline]
    date_hierarchy = "completed_date"
