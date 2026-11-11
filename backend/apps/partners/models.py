from django.db import models
from core.models import TranslatedModel, OrderedModel, ActiveModel


class Partner(TranslatedModel, OrderedModel, ActiveModel):
    class Kind(models.TextChoices):
        TECHNOLOGY = "technology", "Texnologik hamkor (uskuna ishlab chiqaruvchi)"
        INDUSTRY = "industry", "Sanoat hamkori (korxona, buyurtmachi)"

    name_uz = models.CharField(max_length=200)
    name_ru = models.CharField(max_length=200, blank=True)
    name_en = models.CharField(max_length=200, blank=True)

    description_uz = models.TextField(blank=True)
    description_ru = models.TextField(blank=True)
    description_en = models.TextField(blank=True)

    kind = models.CharField(
        max_length=20, choices=Kind.choices, default=Kind.TECHNOLOGY, db_index=True,
        help_text="Hamkorlar sahifasida qaysi guruhda chiqishi",
    )
    country_uz = models.CharField(max_length=100, blank=True, help_text="Masalan: Germaniya")
    country_ru = models.CharField(max_length=100, blank=True)
    country_en = models.CharField(max_length=100, blank=True)

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
