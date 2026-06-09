from django.contrib import admin
from unfold.admin import ModelAdmin
from django.utils import timezone
from .models import Lead


@admin.register(Lead)
class LeadAdmin(ModelAdmin):
    list_display = ("name", "company", "phone", "email", "status", "source_page", "created_at")
    list_editable = ("status",)
    list_filter = ("status", "created_at")
    search_fields = ("name", "company", "phone", "email")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"
    actions = ["mark_done", "mark_spam"]

    @admin.action(description="Bajarildi deb belgilash")
    def mark_done(self, request, queryset):
        queryset.update(status=Lead.Status.DONE, processed_at=timezone.now())

    @admin.action(description="Spam deb belgilash")
    def mark_spam(self, request, queryset):
        queryset.update(status=Lead.Status.SPAM)
