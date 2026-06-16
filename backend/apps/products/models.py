from django.db import models
from django.utils.text import slugify
from core.models import TranslatedModel, OrderedModel, ActiveModel


class ProductCategory(TranslatedModel, OrderedModel, ActiveModel):
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="children",
        verbose_name="Asosiy kategoriya",
        help_text="Ichki kategoriya bo'lsa, asosiy kategoriyani tanlang. Aks holda bo'sh qoldiring.",
    )
    slug = models.SlugField(max_length=120, unique=True, blank=True)

    name_uz = models.CharField("Nomi (uz)", max_length=200)
    name_ru = models.CharField("Nomi (ru)", max_length=200, blank=True)
    name_en = models.CharField("Nomi (en)", max_length=200, blank=True)

    icon = models.CharField(max_length=100, blank=True, help_text="Icon class or name")
    cover_image = models.ImageField(upload_to="products/categories/", blank=True, null=True)

    class Meta:
        verbose_name = "Mahsulot kategoriyasi"
        verbose_name_plural = "Mahsulot kategoriyalari"
        ordering = ["order"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_uz or self.name_en or self.name_ru)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name_uz or self.name_en or f"Category #{self.pk}"


class Product(TranslatedModel, OrderedModel, ActiveModel):
    class Availability(models.TextChoices):
        AVAILABLE = "available", "Mavjud"
        ON_ORDER = "on_order", "Buyurtma asosida"
        DISCONTINUED = "discontinued", "Ishlab chiqarishdan olingan"

    category = models.ForeignKey(
        ProductCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="products",
        verbose_name="Kategoriya",
    )
    slug = models.SlugField(max_length=180, unique=True, blank=True)

    sku = models.CharField(
        "Artikul / Model raqami",
        max_length=100,
        blank=True,
        db_index=True,
        help_text="Mahsulotning model yoki artikul raqami. Masalan: ВРУ-1-21-10",
    )
    brand = models.CharField(
        "Brend / Ishlab chiqaruvchi",
        max_length=120,
        blank=True,
        help_text="Ixtiyoriy. Masalan: Ichab, Schneider Electric",
    )
    availability = models.CharField(
        "Mavjudlik holati",
        max_length=20,
        choices=Availability.choices,
        default=Availability.AVAILABLE,
    )

    name_uz = models.CharField("Nomi (uz)", max_length=250)
    name_ru = models.CharField("Nomi (ru)", max_length=250, blank=True)
    name_en = models.CharField("Nomi (en)", max_length=250, blank=True)

    short_description_uz = models.CharField(
        "Qisqa tavsif (uz)", max_length=300, blank=True,
        help_text="Karta va qidiruv natijalarida ko'rinadigan 1-2 jumlalik tavsif.",
    )
    short_description_ru = models.CharField("Qisqa tavsif (ru)", max_length=300, blank=True)
    short_description_en = models.CharField("Qisqa tavsif (en)", max_length=300, blank=True)

    description_uz = models.TextField("To'liq tavsif (uz)", blank=True)
    description_ru = models.TextField("To'liq tavsif (ru)", blank=True)
    description_en = models.TextField("To'liq tavsif (en)", blank=True)

    # ─── SEO (qidiruv tizimlari uchun) ──────────────────────────────────────
    meta_title_uz = models.CharField("SEO sarlavha (uz)", max_length=200, blank=True,
        help_text="Bo'sh qoldirilsa mahsulot nomi ishlatiladi.")
    meta_title_ru = models.CharField("SEO sarlavha (ru)", max_length=200, blank=True)
    meta_title_en = models.CharField("SEO sarlavha (en)", max_length=200, blank=True)
    meta_description_uz = models.CharField("SEO tavsif (uz)", max_length=300, blank=True,
        help_text="Bo'sh qoldirilsa qisqa tavsif ishlatiladi.")
    meta_description_ru = models.CharField("SEO tavsif (ru)", max_length=300, blank=True)
    meta_description_en = models.CharField("SEO tavsif (en)", max_length=300, blank=True)

    catalog_file = models.FileField(
        "Katalog / Datasheet (PDF)", upload_to="products/catalogs/", blank=True, null=True,
    )

    class Meta:
        verbose_name = "Mahsulot"
        verbose_name_plural = "Mahsulotlar"
        ordering = ["order"]
        indexes = [
            models.Index(fields=["is_active", "category"]),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_uz or self.name_en or self.name_ru)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name_uz or self.name_en or f"Product #{self.pk}"


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/images/")
    alt_uz = models.CharField(max_length=200, blank=True)
    alt_ru = models.CharField(max_length=200, blank=True)
    alt_en = models.CharField(max_length=200, blank=True)
    is_main = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Mahsulot rasmi"
        verbose_name_plural = "Mahsulot rasmlari"
        ordering = ["-is_main", "order"]

    def __str__(self):
        return f"{self.product} — rasm #{self.pk}"


class ProductSpecification(models.Model):
    """Oddiy (bitta qiymatli) texnik xususiyat — variantlarsiz mahsulotlar uchun."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="specs")
    label_uz = models.CharField("Nomi (uz)", max_length=200, help_text="Masalan: Quvvat manbai")
    label_ru = models.CharField("Nomi (ru)", max_length=200, blank=True, help_text="Masalan: Питание")
    label_en = models.CharField("Nomi (en)", max_length=200, blank=True, help_text="Masalan: Power supply")
    value = models.CharField("Qiymati", max_length=500, help_text="Masalan: 24V DC, 0.5A")
    unit = models.CharField("O'lchov birligi", max_length=40, blank=True, help_text="Ixtiyoriy. Masalan: A, В, мм")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Texnik xususiyat"
        verbose_name_plural = "Texnik xususiyatlar (oddiy)"
        ordering = ["order"]

    def __str__(self):
        return f"{self.label_uz}: {self.value}"


class ProductParameter(models.Model):
    """Ko'p ustunli taqqoslash jadvalining QATORI (masalan: 'Номинальная мощность')."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="parameters")
    label_uz = models.CharField("Parametr nomi (uz)", max_length=200)
    label_ru = models.CharField("Parametr nomi (ru)", max_length=200, blank=True)
    label_en = models.CharField("Parametr nomi (en)", max_length=200, blank=True)
    unit = models.CharField("O'lchov birligi", max_length=40, blank=True, help_text="Masalan: кВА, А, В, мм")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Jadval parametri (qator)"
        verbose_name_plural = "Jadval parametrlari (qatorlar)"
        ordering = ["order"]

    def __str__(self):
        return self.label_uz or self.label_ru or f"Parameter #{self.pk}"


class ProductVariant(models.Model):
    """Ko'p ustunli taqqoslash jadvalining USTUNI (masalan: 'ВТЕ-200/48')."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    code = models.CharField("Variant kodi / nomi", max_length=120)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Mahsulot varianti (ustun)"
        verbose_name_plural = "Mahsulot variantlari (ustunlar)"
        ordering = ["order"]

    def __str__(self):
        return self.code or f"Variant #{self.pk}"


class ProductVariantValue(models.Model):
    """Jadval katagi: muayyan variantning muayyan parametr bo'yicha qiymati."""
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name="values")
    parameter = models.ForeignKey(ProductParameter, on_delete=models.CASCADE, related_name="values")
    value = models.CharField("Qiymati", max_length=200, blank=True)

    class Meta:
        verbose_name = "Variant qiymati (katak)"
        verbose_name_plural = "Variant qiymatlari (kataklar)"
        unique_together = ("variant", "parameter")

    def __str__(self):
        return f"{self.variant.code} / {self.parameter.label_uz}: {self.value}"
