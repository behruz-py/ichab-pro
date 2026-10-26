from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import InternalDataset


@admin.register(InternalDataset)
class InternalDatasetAdmin(ModelAdmin):
    list_display = ("title", "key", "updated_at")
    search_fields = ("title", "key")
    readonly_fields = ("updated_at",)
