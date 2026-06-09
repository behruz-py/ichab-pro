from django.db import models
from core.models import TranslatedModel, OrderedModel, ActiveModel


class PageContent(TranslatedModel, OrderedModel, ActiveModel):
    """
    Flexible content blocks for static pages (About, Mission, History, etc.).
    Each block has a unique `key` so the frontend can fetch specific blocks.
    Examples: "about_mission", "about_history", "about_vision", "home_intro"
    """
    key = models.SlugField(
        max_length=100,
        unique=True,
        help_text="Unique key to identify this block, e.g. 'about_mission'"
    )

    title_uz = models.CharField(max_length=300, blank=True)
    title_ru = models.CharField(max_length=300, blank=True)
    title_en = models.CharField(max_length=300, blank=True)

    subtitle_uz = models.CharField(max_length=400, blank=True)
    subtitle_ru = models.CharField(max_length=400, blank=True)
    subtitle_en = models.CharField(max_length=400, blank=True)

    body_uz = models.TextField(blank=True)
    body_ru = models.TextField(blank=True)
    body_en = models.TextField(blank=True)

    image = models.ImageField(upload_to="pages/", blank=True, null=True)

    # Optional metadata for the block (icon, color, etc.)
    meta = models.JSONField(default=dict, blank=True)

    class Meta:
        verbose_name = "Sahifa kontenti"
        verbose_name_plural = "Sahifa kontentlari"
        ordering = ["order"]

    def __str__(self):
        return f"[{self.key}] {self.title_uz or self.title_en}"
