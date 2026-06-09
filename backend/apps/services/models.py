from django.db import models
from django.utils.text import slugify
from core.models import TranslatedModel, OrderedModel, ActiveModel


class Service(TranslatedModel, OrderedModel, ActiveModel):
    division = models.ForeignKey(
        "divisions.Division",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="services",
    )
    slug = models.SlugField(max_length=150, unique=True, blank=True)

    name_uz = models.CharField(max_length=250)
    name_ru = models.CharField(max_length=250, blank=True)
    name_en = models.CharField(max_length=250, blank=True)

    description_uz = models.TextField(blank=True)
    description_ru = models.TextField(blank=True)
    description_en = models.TextField(blank=True)

    short_description_uz = models.TextField(blank=True)
    short_description_ru = models.TextField(blank=True)
    short_description_en = models.TextField(blank=True)

    icon = models.CharField(max_length=100, blank=True, help_text="Icon class or SVG name")
    cover_image = models.ImageField(upload_to="services/covers/", blank=True, null=True)

    price_from = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True,
        help_text="Minimum narx (ixtiyoriy)"
    )

    class Meta:
        verbose_name = "Xizmat"
        verbose_name_plural = "Xizmatlar"
        ordering = ["order"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_uz or self.name_en or self.name_ru)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name_uz or self.name_en or f"Service #{self.pk}"


class ServiceImage(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="services/images/")
    is_main = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Xizmat rasmi"
        verbose_name_plural = "Xizmat rasmlari"
        ordering = ["-is_main", "order"]

    def __str__(self):
        return f"{self.service} — rasm #{self.pk}"
