from django.db import models
from core.models import TranslatedModel, OrderedModel, ActiveModel


class Certificate(TranslatedModel, OrderedModel, ActiveModel):
    name_uz = models.CharField(max_length=300)
    name_ru = models.CharField(max_length=300, blank=True)
    name_en = models.CharField(max_length=300, blank=True)

    issuing_organization_uz = models.CharField(max_length=300, blank=True)
    issuing_organization_ru = models.CharField(max_length=300, blank=True)
    issuing_organization_en = models.CharField(max_length=300, blank=True)

    issued_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)

    image = models.ImageField(upload_to="certificates/images/", blank=True, null=True)
    document = models.FileField(upload_to="certificates/docs/", blank=True, null=True)

    is_international = models.BooleanField(
        default=False,
        help_text="Xalqaro sertifikat bo'lsa True, milliy bo'lsa False"
    )

    class Meta:
        verbose_name = "Sertifikat"
        verbose_name_plural = "Sertifikatlar"
        ordering = ["order"]

    def __str__(self):
        return self.name_uz or self.name_en or f"Certificate #{self.pk}"
