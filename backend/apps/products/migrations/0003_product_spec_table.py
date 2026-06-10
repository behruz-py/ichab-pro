from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0002_productspecification"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="spec_table",
            field=models.TextField(
                blank=True,
                default="",
                verbose_name="Ko'p ustunli jadval",
                help_text=(
                    "Ixtiyoriy. Birinchi qator — ustun sarlavhalari (| bilan ajrating).\n"
                    "Qolgan qatorlar — ma'lumot. Misol:\n"
                    "Parametr | ВТЕ-200/48 | ВТЕ-315/75\n"
                    "Nominal quvvat, kVA | 15,12 | 23,62\n"
                    "Nominal tok, A | 200 | 315"
                ),
            ),
            preserve_default=False,
        ),
    ]
