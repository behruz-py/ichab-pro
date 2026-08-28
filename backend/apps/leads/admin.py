from django.contrib import admin
from unfold.admin import ModelAdmin
from django.utils import timezone
from .models import Lead


@admin.register(Lead)
class LeadAdmin(ModelAdmin):
    """
    Restricted to a "Aloqa operatori" (contact operator) account in
    production — see the `create_contact_operator_group` migration. That
    account only has view/change permission on this one model, and this
    admin further narrows what "change" means: the customer's own submitted
    data is always readonly, only the internal status/notes are editable,
    and nobody (not even the operator) can hand-create or delete a lead —
    leads only ever come from the public contact form.
    """
    list_display = ("name", "company", "phone", "email", "status", "source_page", "created_at")
    list_editable = ("status",)
    list_filter = ("status", "created_at")
    search_fields = ("name", "company", "phone", "email")
    date_hierarchy = "created_at"
    actions = ["mark_done", "mark_spam"]

    fieldsets = (
        ("Murojaat (mijoz yuborgan, tahrirlab bo'lmaydi)", {
            "fields": ("name", "company", "phone", "email", "subject", "message", "source_page", "created_at"),
        }),
        ("Ishlov berish", {
            "fields": ("status", "notes", "processed_at"),
        }),
    )
    readonly_fields = ("name", "company", "phone", "email", "subject", "message", "source_page", "created_at", "updated_at")

    def has_add_permission(self, request):
        # Leads only ever come from the public contact-form API — there is
        # no legitimate reason to hand-create one in admin.
        return False

    def has_delete_permission(self, request, obj=None):
        # Operators mark a lead "Bajarildi"/"Spam" instead of deleting it,
        # so a real customer inquiry can't quietly disappear. Only a
        # superuser can actually delete.
        return request.user.is_superuser

    @admin.action(description="Bajarildi deb belgilash")
    def mark_done(self, request, queryset):
        queryset.update(status=Lead.Status.DONE, processed_at=timezone.now())

    @admin.action(description="Spam deb belgilash")
    def mark_spam(self, request, queryset):
        queryset.update(status=Lead.Status.SPAM)
