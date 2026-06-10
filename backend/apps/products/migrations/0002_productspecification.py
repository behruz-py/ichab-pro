import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ProductSpecification",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("label_uz", models.CharField(help_text="Masalan: Quvvat manbai", max_length=200)),
                ("label_ru", models.CharField(blank=True, help_text="Masalan: Питание", max_length=200)),
                ("label_en", models.CharField(blank=True, help_text="Masalan: Power supply", max_length=200)),
                ("value", models.CharField(help_text="Masalan: 24V DC, 0.5A", max_length=500)),
                ("order", models.PositiveIntegerField(default=0)),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="specs",
                        to="products.product",
                    ),
                ),
            ],
            options={
                "verbose_name": "Texnik xususiyat",
                "verbose_name_plural": "Texnik xususiyatlar",
                "ordering": ["order"],
            },
        ),
    ]
