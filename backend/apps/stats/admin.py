from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Statistic


@admin.register(Statistic)
class StatisticAdmin(ModelAdmin):
    list_display = ("label_uz", "value", "suffix_uz", "icon", "is_active", "order")
    list_editable = ("value", "is_active", "order")
    list_filter = ("is_active",)
    search_fields = ("label_uz", "label_ru", "label_en")
