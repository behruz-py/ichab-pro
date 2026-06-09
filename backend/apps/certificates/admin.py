from django.contrib import admin
from .models import Certificate


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ("name_uz", "issuing_organization_uz", "issued_date", "is_international", "is_active", "order")
    list_editable = ("is_active", "order")
    list_filter = ("is_active", "is_international")
    search_fields = ("name_uz", "name_ru", "name_en", "issuing_organization_uz")
    date_hierarchy = "issued_date"
