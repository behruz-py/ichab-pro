from django.db import models


class InternalDataset(models.Model):
    """Staff-only figures (budgets, production volumes, shares) — served only
    to authenticated users, never through the public API."""

    key = models.SlugField("Kalit", max_length=64, unique=True)
    title = models.CharField("Nomi", max_length=200)
    data = models.JSONField("Ma'lumot", default=dict)
    updated_at = models.DateTimeField("Yangilangan", auto_now=True)

    class Meta:
        ordering = ["key"]
        verbose_name = "Ichki ma'lumotlar to'plami"
        verbose_name_plural = "Ichki ma'lumotlar to'plamlari"

    def __str__(self):
        return self.title
