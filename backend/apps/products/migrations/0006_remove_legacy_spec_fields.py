"""Ma'lumot ko'chirilgandan keyin eski maydonlarni o'chiradi:
`spec_table` (pipe-format) va `specifications` (ishlatilmagan JSONField)."""
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0005_migrate_spec_table_to_variants"),
    ]
    operations = [
        migrations.RemoveField(model_name="product", name="spec_table"),
        migrations.RemoveField(model_name="product", name="specifications"),
    ]
