from apps.products.models import ProductCategory, Product

CATEGORIES = [
    dict(slug="plc", name_uz="Dasturlanadigan mantiqiy kontrollerlar (PLC)",
         name_ru="Программируемые логические контроллеры (ПЛК)",
         name_en="Programmable Logic Controllers (PLC)", icon="cpu", order=1),
    dict(slug="plc-siemens", name_uz="Siemens SIMATIC", name_ru="Siemens SIMATIC",
         name_en="Siemens SIMATIC", icon="cpu", parent_slug="plc", order=1),
    dict(slug="plc-ab", name_uz="Allen-Bradley", name_ru="Allen-Bradley",
         name_en="Allen-Bradley", icon="cpu", parent_slug="plc", order=2),
    dict(slug="scada", name_uz="SCADA dasturlari va HMI", name_ru="SCADA-системы и HMI",
         name_en="SCADA Software and HMI", icon="monitor", order=2),
    dict(slug="sensors", name_uz="Sanoat sensorlari", name_ru="Промышленные датчики",
         name_en="Industrial Sensors", icon="activity", order=3),
    dict(slug="sensors-pressure", name_uz="Bosim sensorlari", name_ru="Датчики давления",
         name_en="Pressure Sensors", icon="gauge", parent_slug="sensors", order=1),
    dict(slug="sensors-temp", name_uz="Temperatura sensorlari", name_ru="Датчики температуры",
         name_en="Temperature Sensors", icon="thermometer", parent_slug="sensors", order=2),
    dict(slug="sensors-flow", name_uz="Oqim o'lchagichlar", name_ru="Расходомеры",
         name_en="Flow Meters", icon="droplets", parent_slug="sensors", order=3),
    dict(slug="drives", name_uz="Chastota o'zgartirgichlar (VFD)", name_ru="Частотные преобразователи",
         name_en="Variable Frequency Drives", icon="zap", order=4),
    dict(slug="panels", name_uz="Boshqaruv shkafları va panellar", name_ru="Шкафы и панели управления",
         name_en="Control Panels and Cabinets", icon="server", order=5),
]

PRODUCTS = [
    dict(
        slug="siemens-s7-1200",
        category_slug="plc-siemens",
        name_uz="Siemens SIMATIC S7-1200",
        name_ru="Siemens SIMATIC S7-1200",
        name_en="Siemens SIMATIC S7-1200",
        description_uz=(
            "Kichik va o'rta o'lchamli qo'llanmalar uchun kompakt PLC. "
            "Integrated PROFINET, veb-server va harakat boshqaruvi. "
            "O'rnatish va sozlash qulay TIA Portal muhitida amalga oshiriladi."
        ),
        description_ru=(
            "Компактный ПЛК для малых и средних приложений. "
            "Встроенный PROFINET, веб-сервер и управление движением. "
            "Программирование в среде TIA Portal."
        ),
        description_en=(
            "Compact PLC for small and medium-scale applications. "
            "Integrated PROFINET, web server and motion control. "
            "Programming in TIA Portal environment."
        ),
        specifications=[
            {"label_uz": "CPU", "label_ru": "CPU", "label_en": "CPU", "value": "CPU 1214C DC/DC/DC"},
            {"label_uz": "Raqamli kirish", "label_ru": "Цифровые входы", "label_en": "Digital inputs", "value": "14"},
            {"label_uz": "Raqamli chiqish", "label_ru": "Цифровые выходы", "label_en": "Digital outputs", "value": "10"},
            {"label_uz": "Analogli kirish", "label_ru": "Аналоговые входы", "label_en": "Analog inputs", "value": "2"},
            {"label_uz": "Xotira", "label_ru": "Память", "label_en": "Memory", "value": "100 KB"},
            {"label_uz": "Kommunikatsiya", "label_ru": "Коммуникация", "label_en": "Communication", "value": "PROFINET"},
        ],
        order=1, is_active=True,
    ),
    dict(
        slug="siemens-s7-300",
        category_slug="plc-siemens",
        name_uz="Siemens SIMATIC S7-300",
        name_ru="Siemens SIMATIC S7-300",
        name_en="Siemens SIMATIC S7-300",
        description_uz=(
            "O'rta va katta o'lchamli ishlab chiqarish jarayonlari uchun modular PLC. "
            "PROFIBUS, PROFINET, MPI protokollarini qo'llab-quvvatlaydi."
        ),
        description_ru=(
            "Модульный ПЛК для средних и крупных производственных процессов. "
            "Поддержка протоколов PROFIBUS, PROFINET, MPI."
        ),
        description_en=(
            "Modular PLC for medium and large-scale production processes. "
            "Supports PROFIBUS, PROFINET, MPI protocols."
        ),
        specifications=[
            {"label_uz": "Protsessor", "label_ru": "Процессор", "label_en": "Processor", "value": "CPU 315-2 PN/DP"},
            {"label_uz": "Tsikl vaqti", "label_ru": "Время цикла", "label_en": "Cycle time", "value": "0.05 ms/1K"},
            {"label_uz": "Xotira", "label_ru": "Память", "label_en": "Memory", "value": "256 KB"},
            {"label_uz": "Kommunikatsiya", "label_ru": "Коммуникация", "label_en": "Communication",
             "value": "PROFIBUS DP, PROFINET"},
        ],
        order=2, is_active=True,
    ),
    dict(
        slug="abb-acs880",
        category_slug="drives",
        name_uz="ABB ACS880 Sanoat chastota o'zgartirgichi",
        name_ru="Частотный преобразователь ABB ACS880",
        name_en="ABB ACS880 Industrial Drive",
        description_uz=(
            "Keng quvvat diapazoni (0.75 kW dan 5600 kW gacha). "
            "Direct torque control (DTC) texnologiyasi. "
            "Energiya tejash — 30-50% gacha."
        ),
        description_ru=(
            "Широкий диапазон мощностей (от 0,75 кВт до 5600 кВт). "
            "Технология прямого управления моментом (DTC). "
            "Экономия энергии до 30-50%."
        ),
        description_en=(
            "Wide power range (0.75 kW to 5600 kW). "
            "Direct torque control (DTC) technology. "
            "Energy savings up to 30-50%."
        ),
        specifications=[
            {"label_uz": "Quvvat diapazoni", "label_ru": "Диапазон мощностей", "label_en": "Power range",
             "value": "0.75–5600 kW"},
            {"label_uz": "Kuchlanish", "label_ru": "Напряжение", "label_en": "Voltage", "value": "380–690 V AC"},
            {"label_uz": "Himoya darajasi", "label_ru": "Степень защиты", "label_en": "Protection class",
             "value": "IP21 / IP55"},
            {"label_uz": "Boshqaruv", "label_ru": "Управление", "label_en": "Control", "value": "DTC"},
        ],
        order=1, is_active=True,
    ),
    dict(
        slug="endress-cerabar",
        category_slug="sensors-pressure",
        name_uz="Endress+Hauser Cerabar bosim sensori",
        name_ru="Датчик давления Endress+Hauser Cerabar",
        name_en="Endress+Hauser Cerabar Pressure Transmitter",
        description_uz=(
            "Sanoat uchun universal bosim o'lchagich. "
            "4–20 mA HART, PROFIBUS PA, Foundation Fieldbus interfeyslari. "
            "Yuqori harorat va agressiv muhitlarga chidamli."
        ),
        description_ru=(
            "Универсальный промышленный датчик давления. "
            "Интерфейсы 4–20 мА HART, PROFIBUS PA, Foundation Fieldbus. "
            "Устойчив к высоким температурам и агрессивным средам."
        ),
        description_en=(
            "Universal industrial pressure transmitter. "
            "4–20 mA HART, PROFIBUS PA, Foundation Fieldbus interfaces. "
            "Resistant to high temperatures and aggressive media."
        ),
        specifications=[
            {"label_uz": "O'lchov diapazoni", "label_ru": "Диапазон измерений", "label_en": "Measuring range",
             "value": "-1…600 bar"},
            {"label_uz": "Aniqlik", "label_ru": "Точность", "label_en": "Accuracy", "value": "±0.1%"},
            {"label_uz": "Harorat", "label_ru": "Температура", "label_en": "Temperature",
             "value": "-40…+125 °C"},
            {"label_uz": "Himoya", "label_ru": "Защита", "label_en": "Protection", "value": "IP66/IP68"},
        ],
        order=1, is_active=True,
    ),
    dict(
        slug="yokogawa-yta",
        category_slug="sensors-temp",
        name_uz="Yokogawa YTA temperatura transmitteri",
        name_ru="Температурный передатчик Yokogawa YTA",
        name_en="Yokogawa YTA Temperature Transmitter",
        description_uz=(
            "Ishonchli temperatura o'lchash — termopora va termistorlarni qo'llab-quvvatlaydi. "
            "HART va BRAIN protokollari. Montaj qulay universal dizayn."
        ),
        description_ru=(
            "Надёжное измерение температуры — поддержка термопар и термосопротивлений. "
            "Протоколы HART и BRAIN. Универсальный дизайн для удобного монтажа."
        ),
        description_en=(
            "Reliable temperature measurement — supports thermocouples and RTDs. "
            "HART and BRAIN protocols. Universal design for easy installation."
        ),
        specifications=[
            {"label_uz": "Kirish turi", "label_ru": "Тип входа", "label_en": "Input type",
             "value": "TC, RTD, mV, Ω"},
            {"label_uz": "Chiqish", "label_ru": "Выход", "label_en": "Output", "value": "4–20 mA HART"},
            {"label_uz": "Aniqlik", "label_ru": "Точность", "label_en": "Accuracy", "value": "±0.1°C"},
        ],
        order=1, is_active=True,
    ),
]


def seed_products():
    slug_to_cat = {}
    cat_created = 0
    for data in CATEGORIES:
        parent_slug = data.pop("parent_slug", None)
        parent = slug_to_cat.get(parent_slug) if parent_slug else None
        obj, is_new = ProductCategory.objects.update_or_create(
            slug=data["slug"], defaults={**data, "parent": parent}
        )
        slug_to_cat[obj.slug] = obj
        if is_new:
            cat_created += 1

    prod_created = 0
    for data in PRODUCTS:
        cat_slug = data.pop("category_slug")
        cat = slug_to_cat.get(cat_slug)
        _, is_new = Product.objects.update_or_create(
            slug=data["slug"], defaults={**data, "category": cat}
        )
        if is_new:
            prod_created += 1

    return len(CATEGORIES), cat_created, len(PRODUCTS), prod_created
