"""Give the partners entered through the admin their official names, a group
(technology vendor vs. industrial partner), country and a one-line field of
activity, in all three languages.

Rows are matched on the raw name typed into the admin (case-insensitive), so a
partner that has since been renamed by hand is left alone; description and
country are filled only when still empty.
"""
from django.db import migrations

T, I = "technology", "industry"

# raw admin name -> (kind, (name uz, ru, en), (country uz, ru, en), (activity uz, ru, en))
DATA = {
    "siemens": (T, ("Siemens",) * 3, ("Germaniya", "Германия", "Germany"),
                ("Sanoat avtomatlashtirish, kontrollerlar va boshqaruv tizimlari",
                 "Промышленная автоматизация, контроллеры и системы управления",
                 "Industrial automation, controllers and control systems")),
    "abb": (T, ("ABB",) * 3, ("Shveytsariya", "Швейцария", "Switzerland"),
            ("Elektrotexnika, elektr yuritmalar va avtomatlashtirish",
             "Электротехника, электроприводы и автоматизация",
             "Electrical engineering, drives and automation")),
    "eh": (T, ("Endress+Hauser",) * 3, ("Shveytsariya", "Швейцария", "Switzerland"),
           ("Texnologik jarayonlar uchun o'lchov asboblari",
            "Контрольно-измерительные приборы для технологических процессов",
            "Process measurement instrumentation")),
    "fluke": (T, ("Fluke Process Instruments",) * 3, ("AQSH", "США", "USA"),
              ("Kalibrlash va sanoat o'lchov asboblari",
               "Калибровочное и промышленное измерительное оборудование",
               "Calibration and industrial test instruments")),
    "dahua": (T, ("Dahua Technology",) * 3, ("Xitoy", "Китай", "China"),
              ("Videokuzatuv va xavfsizlik tizimlari",
               "Системы видеонаблюдения и безопасности",
               "Video surveillance and security systems")),
    "chint": (T, ("CHINT",) * 3, ("Xitoy", "Китай", "China"),
              ("Past kuchlanishli elektr jihozlari",
               "Низковольтное электрооборудование",
               "Low-voltage electrical equipment")),
    "iek": (T, ("IEK",) * 3, ("Rossiya", "Россия", "Russia"),
            ("Elektrotexnika mahsulotlari",
             "Электротехническая продукция",
             "Electrical products")),
    "invt": (T, ("INVT",) * 3, ("Xitoy", "Китай", "China"),
             ("Chastota o'zgartirgichlari va sanoat avtomatikasi",
              "Частотные преобразователи и промышленная автоматика",
              "Variable-frequency drives and industrial automation")),
    "promkip": (T, ("PromKIP Avtomatika Engineering", "ПромКИП Автоматика Инжиниринг", "PromKIP Automation Engineering"),
                ("", "", ""),
                ("Avtomatlashtirish va muhandislik yechimlari",
                 "Решения в области автоматизации и инжиниринга",
                 "Automation and engineering solutions")),
    "navoiyazot": (I, ("«Navoiyazot» AJ", "АО «Навоиазот»", "Navoiyazot JSC"),
                   ("O'zbekiston", "Узбекистан", "Uzbekistan"),
                   ("Kimyo sanoati, mineral o'g'itlar ishlab chiqarish",
                    "Химическая промышленность, производство минеральных удобрений",
                    "Chemical industry, mineral fertilizer production")),
    "qizilqum": (I, ("«Qizilqumsement» AJ", "АО «Кызылкумцемент»", "Kyzylkumcement JSC"),
                 ("O'zbekiston", "Узбекистан", "Uzbekistan"),
                 ("Sement ishlab chiqarish", "Производство цемента", "Cement production")),
    "economzona": (I, ("«Navoiy» erkin industrial-iqtisodiy zonasi",
                       "Свободная индустриально-экономическая зона «Навои»",
                       "Navoi Free Industrial Economic Zone"),
                   ("O'zbekiston", "Узбекистан", "Uzbekistan"),
                   ("Sanoat korxonalari uchun maxsus iqtisodiy zona",
                    "Особая экономическая зона для промышленных предприятий",
                    "Special economic zone for industrial companies")),
}
LANGS = ("uz", "ru", "en")


def forwards(apps, schema_editor):
    Partner = apps.get_model("partners", "Partner")
    for p in Partner.objects.all():
        row = DATA.get((p.name_uz or "").strip().lower())
        if not row:
            continue
        kind, names, countries, activity = row
        p.kind = kind
        for i, lang in enumerate(LANGS):
            setattr(p, f"name_{lang}", names[i])
            if not getattr(p, f"country_{lang}"):
                setattr(p, f"country_{lang}", countries[i])
            if not getattr(p, f"description_{lang}"):
                setattr(p, f"description_{lang}", activity[i])
        p.save()


class Migration(migrations.Migration):
    dependencies = [("partners", "0002_kind_country")]
    operations = [migrations.RunPython(forwards, migrations.RunPython.noop)]
