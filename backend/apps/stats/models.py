from django.db import models
from core.models import TranslatedModel, OrderedModel, ActiveModel


class Statistic(TranslatedModel, OrderedModel, ActiveModel):
    label_uz = models.CharField(max_length=200, help_text="Masalan: 'Bajarilgan loyihalar'")
    label_ru = models.CharField(max_length=200, blank=True)
    label_en = models.CharField(max_length=200, blank=True)

    # Integer value for animated counter (JS animates from 0 to this)
    value = models.PositiveIntegerField(default=0)

    # Suffix shown after the number: "+", "%", "ta", "yil" etc. (translated)
    suffix_uz = models.CharField(max_length=20, blank=True, help_text="Masalan: '+'")
    suffix_ru = models.CharField(max_length=20, blank=True)
    suffix_en = models.CharField(max_length=20, blank=True)

    icon = models.CharField(max_length=100, blank=True, help_text="Icon class or SVG name")

    class Meta:
        verbose_name = "Statistika"
        verbose_name_plural = "Statistikalar"
        ordering = ["order"]

    def __str__(self):
        return f"{self.label_uz}: {self.value}{self.suffix_uz}"
