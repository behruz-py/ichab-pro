from django.db import models
from django.utils.text import slugify
from core.models import TranslatedModel, OrderedModel, ActiveModel


class Project(TranslatedModel, OrderedModel, ActiveModel):
    slug = models.SlugField(max_length=180, unique=True, blank=True)

    name_uz = models.CharField(max_length=250)
    name_ru = models.CharField(max_length=250, blank=True)
    name_en = models.CharField(max_length=250, blank=True)

    client_uz = models.CharField(max_length=250, blank=True)
    client_ru = models.CharField(max_length=250, blank=True)
    client_en = models.CharField(max_length=250, blank=True)

    description_uz = models.TextField(blank=True)
    description_ru = models.TextField(blank=True)
    description_en = models.TextField(blank=True)

    result_uz = models.TextField(blank=True, help_text="Erishilgan natija")
    result_ru = models.TextField(blank=True)
    result_en = models.TextField(blank=True)

    location_uz = models.CharField(max_length=200, blank=True)
    location_ru = models.CharField(max_length=200, blank=True)
    location_en = models.CharField(max_length=200, blank=True)

    completed_date = models.DateField(null=True, blank=True)

    division = models.ForeignKey(
        "divisions.Division",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="projects",
    )

    class Meta:
        verbose_name = "Loyiha / Obyekt"
        verbose_name_plural = "Loyihalar / Obyektlar"
        ordering = ["order"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_uz or self.name_en or self.name_ru)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name_uz or self.name_en or f"Project #{self.pk}"


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="projects/images/")
    caption_uz = models.CharField(max_length=200, blank=True)
    caption_ru = models.CharField(max_length=200, blank=True)
    caption_en = models.CharField(max_length=200, blank=True)
    is_main = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Loyiha rasmi"
        verbose_name_plural = "Loyiha rasmlari"
        ordering = ["-is_main", "order"]

    def __str__(self):
        return f"{self.project} — rasm #{self.pk}"
