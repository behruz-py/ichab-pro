from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import ProductCategory, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ("image", "is_main", "order", "alt_uz")


@admin.register(ProductCategory)
class ProductCategoryAdmin(ModelAdmin):
    list_display = ("name_uz", "parent", "slug", "is_active", "order")
    list_editable = ("is_active", "order")
    list_filter = ("is_active", "parent")
    search_fields = ("name_uz", "name_ru", "name_en")
    prepopulated_fields = {"slug": ("name_uz",)}


@admin.register(Product)
class ProductAdmin(ModelAdmin):
    list_display = ("name_uz", "category", "is_active", "order", "created_at")
    list_editable = ("is_active", "order")
    list_filter = ("is_active", "category")
    search_fields = ("name_uz", "name_ru", "name_en")
    prepopulated_fields = {"slug": ("name_uz",)}
    inlines = [ProductImageInline]
    fieldsets = (
        ("Kategoriya & Slug", {"fields": ("category", "slug")}),
        ("Nomi", {"fields": ("name_uz", "name_ru", "name_en")}),
        ("Tavsif", {"fields": ("description_uz", "description_ru", "description_en")}),
        ("Texnik xususiyatlar", {"fields": ("specifications",)}),
        ("Fayl", {"fields": ("catalog_file",)}),
        ("Sozlamalar", {"fields": ("order", "is_active")}),
    )
