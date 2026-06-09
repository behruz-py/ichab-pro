from django.db import models
from django.utils.text import slugify
from core.models import TranslatedModel, OrderedModel, ActiveModel


class Division(TranslatedModel, OrderedModel, ActiveModel):
    slug = models.SlugField(max_length=120, unique=True, blank=True)

    name_uz = models.CharField(max_length=200)
    name_ru = models.CharField(max_length=200, blank=True)
    name_en = models.CharField(max_length=200, blank=True)

    short_description_uz = models.TextField(blank=True)
    short_description_ru = models.TextField(blank=True)
    short_description_en = models.TextField(blank=True)

    full_description_uz = models.TextField(blank=True)
    full_description_ru = models.TextField(blank=True)
    full_description_en = models.TextField(blank=True)

    logo = models.ImageField(upload_to="divisions/logos/", blank=True, null=True)
    cover_image = models.ImageField(upload_to="divisions/covers/", blank=True, null=True)

    leader_name_uz = models.CharField(max_length=200, blank=True)
    leader_name_ru = models.CharField(max_length=200, blank=True)
    leader_name_en = models.CharField(max_length=200, blank=True)

    leader_position_uz = models.CharField(max_length=200, blank=True)
    leader_position_ru = models.CharField(max_length=200, blank=True)
    leader_position_en = models.CharField(max_length=200, blank=True)

    contact_phone = models.CharField(max_length=30, blank=True)
    contact_email = models.EmailField(blank=True)

    class Meta:
        verbose_name = "Bo'linma"
        verbose_name_plural = "Bo'linmalar"
        ordering = ["order"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_uz or self.name_en or self.name_ru)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name_uz or self.name_en or f"Division #{self.pk}"
