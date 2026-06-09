from django.db import models
from django.utils.text import slugify
from core.models import TranslatedModel, OrderedModel, ActiveModel


class ProductCategory(TranslatedModel, OrderedModel, ActiveModel):
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="children",
    )
    slug = models.SlugField(max_length=120, unique=True, blank=True)

    name_uz = models.CharField(max_length=200)
    name_ru = models.CharField(max_length=200, blank=True)
    name_en = models.CharField(max_length=200, blank=True)

    icon = models.CharField(max_length=100, blank=True, help_text="Icon class or name")
    cover_image = models.ImageField(upload_to="products/categories/", blank=True, null=True)

    class Meta:
        verbose_name = "Mahsulot kategoriyasi"
        verbose_name_plural = "Mahsulot kategoriyalari"
        ordering = ["order"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_uz or self.name_en or self.name_ru)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name_uz or self.name_en or f"Category #{self.pk}"


class Product(TranslatedModel, OrderedModel, ActiveModel):
    category = models.ForeignKey(
        ProductCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="products",
    )
    slug = models.SlugField(max_length=180, unique=True, blank=True)

    name_uz = models.CharField(max_length=250)
    name_ru = models.CharField(max_length=250, blank=True)
    name_en = models.CharField(max_length=250, blank=True)

    description_uz = models.TextField(blank=True)
    description_ru = models.TextField(blank=True)
    description_en = models.TextField(blank=True)

    # Flexible technical specs: [{"label_uz": "...", "label_ru": "...", "label_en": "...", "value": "..."}]
    specifications = models.JSONField(default=list, blank=True)

    catalog_file = models.FileField(upload_to="products/catalogs/", blank=True, null=True)

    class Meta:
        verbose_name = "Mahsulot"
        verbose_name_plural = "Mahsulotlar"
        ordering = ["order"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_uz or self.name_en or self.name_ru)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name_uz or self.name_en or f"Product #{self.pk}"


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/images/")
    alt_uz = models.CharField(max_length=200, blank=True)
    alt_ru = models.CharField(max_length=200, blank=True)
    alt_en = models.CharField(max_length=200, blank=True)
    is_main = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Mahsulot rasmi"
        verbose_name_plural = "Mahsulot rasmlari"
        ordering = ["-is_main", "order"]

    def __str__(self):
        return f"{self.product} — rasm #{self.pk}"
