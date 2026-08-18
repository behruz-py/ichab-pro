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


# ─── Per-division laboratory content (universal — same fields, any division) ──
# These let the admin build a full "laboratory" detail page (stats, capabilities,
# equipment, gallery, standards, team) for ANY division without touching code.
# Related/completed work is intentionally NOT duplicated here — it reuses the
# existing apps.projects.Project model (already has a `division` FK + images).

class DivisionStat(models.Model):
    """A single animated-counter stat shown near the top of the lab page."""
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name="stats")
    icon = models.CharField(
        "Ikonka", max_length=50, blank=True,
        help_text="Lucide ikonka nomi, masalan: Gauge, Cpu, ShieldCheck, Activity",
    )
    value = models.PositiveIntegerField("Raqam", help_text="Masalan: 15")
    suffix = models.CharField("Qo'shimcha belgi", max_length=10, blank=True, help_text="Masalan: +, /7, %")
    label_uz = models.CharField("Izoh (uz)", max_length=150)
    label_ru = models.CharField("Izoh (ru)", max_length=150, blank=True)
    label_en = models.CharField("Izoh (en)", max_length=150, blank=True)
    order = models.PositiveIntegerField("Tartib", default=0)

    class Meta:
        verbose_name = "Statistika ko'rsatkichi"
        verbose_name_plural = "Statistika ko'rsatkichlari"
        ordering = ["order"]

    def __str__(self):
        return f"{self.division} — {self.label_uz}"


class DivisionCapability(models.Model):
    """One "what we do" capability/service card."""
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name="capabilities")
    icon = models.CharField("Ikonka", max_length=50, blank=True, help_text="Lucide ikonka nomi")
    title_uz = models.CharField("Nomi (uz)", max_length=250)
    title_ru = models.CharField("Nomi (ru)", max_length=250, blank=True)
    title_en = models.CharField("Nomi (en)", max_length=250, blank=True)
    order = models.PositiveIntegerField("Tartib", default=0)

    class Meta:
        verbose_name = "Imkoniyat / xizmat"
        verbose_name_plural = "Imkoniyatlar va xizmatlar"
        ordering = ["order"]

    def __str__(self):
        return self.title_uz


class DivisionEquipment(models.Model):
    """A key piece of equipment. Real photo optional — falls back to an icon tile."""
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name="equipment")
    icon = models.CharField(
        "Ikonka", max_length=50, blank=True,
        help_text="Rasm yuklanmasa shu ikonka ko'rsatiladi. Lucide ikonka nomi.",
    )
    image = models.ImageField("Rasmi", upload_to="divisions/equipment/", blank=True, null=True)
    name_uz = models.CharField("Nomi (uz)", max_length=200)
    name_ru = models.CharField("Nomi (ru)", max_length=200, blank=True)
    name_en = models.CharField("Nomi (en)", max_length=200, blank=True)
    model_name = models.CharField("Model / brend", max_length=150, blank=True, help_text="Masalan: Siemens S7-1500")
    order = models.PositiveIntegerField("Tartib", default=0)

    class Meta:
        verbose_name = "Jihoz"
        verbose_name_plural = "Jihozlar"
        ordering = ["order"]

    def __str__(self):
        return self.name_uz


class DivisionImage(models.Model):
    """A gallery photo for the lab page."""
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name="gallery")
    image = models.ImageField("Rasm", upload_to="divisions/gallery/")
    caption_uz = models.CharField("Izoh (uz)", max_length=200, blank=True)
    caption_ru = models.CharField("Izoh (ru)", max_length=200, blank=True)
    caption_en = models.CharField("Izoh (en)", max_length=200, blank=True)
    order = models.PositiveIntegerField("Tartib", default=0)

    class Meta:
        verbose_name = "Galereya rasmi"
        verbose_name_plural = "Galereya rasmlari"
        ordering = ["order"]

    def __str__(self):
        return f"{self.division} — rasm #{self.pk}"


class DivisionStandard(models.Model):
    """A standard / accreditation badge (ISO 9001:2015, GOST ...)."""
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name="standards")
    name = models.CharField("Nomi", max_length=150, help_text="Masalan: ISO 9001:2015")
    order = models.PositiveIntegerField("Tartib", default=0)

    class Meta:
        verbose_name = "Standart / sertifikat"
        verbose_name_plural = "Standartlar va sertifikatlar"
        ordering = ["order"]

    def __str__(self):
        return self.name


class DivisionTeamMember(models.Model):
    """A team member shown below the division leader (who lives on Division itself)."""
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name="team_members")
    photo = models.ImageField("Surati", upload_to="divisions/team/", blank=True, null=True)
    name_uz = models.CharField("Ismi (uz)", max_length=200, blank=True, help_text="Bo'sh qoldirsa faqat lavozim ko'rinadi")
    name_ru = models.CharField("Ismi (ru)", max_length=200, blank=True)
    name_en = models.CharField("Ismi (en)", max_length=200, blank=True)
    position_uz = models.CharField("Lavozimi (uz)", max_length=200)
    position_ru = models.CharField("Lavozimi (ru)", max_length=200, blank=True)
    position_en = models.CharField("Lavozimi (en)", max_length=200, blank=True)
    order = models.PositiveIntegerField("Tartib", default=0)

    class Meta:
        verbose_name = "Jamoa a'zosi"
        verbose_name_plural = "Jamoa a'zolari"
        ordering = ["order"]

    def __str__(self):
        return self.name_uz or self.position_uz
