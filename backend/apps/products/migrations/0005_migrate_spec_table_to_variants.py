"""Eski `spec_table` pipe-format matnini ProductParameter/ProductVariant/
ProductVariantValue strukturasiga ko'chiradi. Ma'lumot yo'qolmaydi."""
from django.db import migrations


def parse_spec_table(raw):
    """Pipe-format matnni (sarlavhalar, qatorlar) ajratadi."""
    lines = [ln.strip() for ln in raw.split("\n") if ln.strip()]
    if len(lines) < 2:
        return None
    headers = [h.strip() for h in lines[0].split("|")]
    if len(headers) < 2:
        return None
    variant_codes = headers[1:]
    rows = []
    for line in lines[1:]:
        cells = [c.strip() for c in line.split("|")]
        rows.append({"label": cells[0], "values": cells[1:]})
    return {"variant_codes": variant_codes, "rows": rows}


def forwards(apps, schema_editor):
    Product = apps.get_model("products", "Product")
    ProductParameter = apps.get_model("products", "ProductParameter")
    ProductVariant = apps.get_model("products", "ProductVariant")
    ProductVariantValue = apps.get_model("products", "ProductVariantValue")

    for product in Product.objects.exclude(spec_table="").exclude(spec_table__isnull=True):
        parsed = parse_spec_table(product.spec_table)
        if not parsed:
            continue

        # Ustunlar (variantlar)
        variants = []
        for i, code in enumerate(parsed["variant_codes"]):
            variants.append(
                ProductVariant.objects.create(product=product, code=code, order=i)
            )

        # Qatorlar (parametrlar) + kataklar (qiymatlar)
        for i, row in enumerate(parsed["rows"]):
            # Eski ma'lumot ruscha — uz va ru maydonlariga joylashtiramiz
            # (translate() fallback ishlashi uchun), keyinroq tarjima qilinadi.
            param = ProductParameter.objects.create(
                product=product,
                label_uz=row["label"],
                label_ru=row["label"],
                order=i,
            )
            for j, variant in enumerate(variants):
                value = row["values"][j] if j < len(row["values"]) else ""
                ProductVariantValue.objects.create(
                    variant=variant, parameter=param, value=value
                )


def backwards(apps, schema_editor):
    """spec_table hali mavjud bo'lgani uchun yangi yozuvlarni o'chiramiz."""
    ProductParameter = apps.get_model("products", "ProductParameter")
    ProductVariant = apps.get_model("products", "ProductVariant")
    ProductParameter.objects.all().delete()
    ProductVariant.objects.all().delete()  # values CASCADE bilan o'chadi


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0004_productparameter_productvariant_productvariantvalue_and_more"),
    ]
    operations = [
        migrations.RunPython(forwards, backwards),
    ]
