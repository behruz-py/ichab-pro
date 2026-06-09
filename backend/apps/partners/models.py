from django.db import models
from core.models import TranslatedModel, OrderedModel, ActiveModel


class Partner(TranslatedModel, OrderedModel, ActiveModel):
    name_uz = models.CharField(max_length=200)
    name_ru = models.CharField(max_length=200, blank=True)
    name_en = models.CharField(max_length=200, blank=True)

    description_uz = models.TextField(blank=True)
    description_ru = models.TextField(blank=True)
    description_en = models.TextField(blank=True)

    logo = models.ImageField(upload_to="partners/logos/")
    website = models.URLField(blank=True)

    is_featured = models.BooleanField(
        default=False,
        help_text="Bosh sahifadagi hamkorlar lentasiga chiqarish"
    )

    class Meta:
        verbose_name = "Hamkor"
        verbose_name_plural = "Hamkorlar"
        ordering = ["order"]

    def __str__(self):
        return self.name_uz or self.name_en or f"Partner #{self.pk}"
