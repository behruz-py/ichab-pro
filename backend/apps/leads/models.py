from django.db import models
from core.models import TimeStampedModel


class Lead(TimeStampedModel):
    class Status(models.TextChoices):
        NEW = "new", "Yangi"
        IN_PROGRESS = "in_progress", "Ko'rilmoqda"
        DONE = "done", "Bajarildi"
        SPAM = "spam", "Spam"

    name = models.CharField(max_length=200)
    company = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    message = models.TextField(blank=True)

    # Which service/division they're interested in (free text)
    subject = models.CharField(max_length=300, blank=True)

    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.NEW, db_index=True
    )
    processed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, help_text="Ichki izohlar (admin uchun)")

    # Source tracking
    source_page = models.CharField(max_length=200, blank=True, help_text="Qaysi sahifadan keldi")

    class Meta:
        verbose_name = "Murojaat"
        verbose_name_plural = "Murojaatlar"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.phone or self.email} ({self.get_status_display()})"
