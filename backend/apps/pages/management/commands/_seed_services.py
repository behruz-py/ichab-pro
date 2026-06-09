from apps.services.models import Service

SERVICES = [
    dict(
        slug="plc-programming",
        division_slug="plc-scada",
        name_uz="PLC dasturlash va loyihalash",
        name_ru="Программирование и проектирование ПЛК",
        name_en="PLC Programming and Engineering",
        short_description_uz="Siemens TIA Portal, Rockwell Studio 5000 va boshqa muhitlarda professional dasturlash.",
        short_description_ru="Профессиональное программирование в Siemens TIA Portal, Rockwell Studio 5000 и других средах.",
        short_description_en="Professional programming in Siemens TIA Portal, Rockwell Studio 5000 and other environments.",
        description_uz=(
            "Texnologik jarayonlarni tahlil qilish, I/O ro'yxatini tuzish, funktsional sxemalarni ishlab chiqish. "
            "Ladder Diagram, Function Block Diagram va Structured Text dasturlash tillari. "
            "Ishga tushirish, sinovdan o'tkazish va hujjatlashtirish."
        ),
        description_ru=(
            "Анализ технологических процессов, составление перечня I/O, разработка функциональных схем. "
            "Языки программирования: Ladder Diagram, FBD, Structured Text. "
            "Пуско-наладка, тестирование и документирование."
        ),
        description_en=(
            "Process analysis, I/O list preparation, functional diagram development. "
            "Programming languages: Ladder Diagram, FBD, Structured Text. "
            "Commissioning, testing and documentation."
        ),
        icon="code-2",
        order=1, is_active=True,
    ),
    dict(
        slug="scada-installation",
        division_slug="plc-scada",
        name_uz="SCADA tizimini o'rnatish va sozlash",
        name_ru="Внедрение и настройка SCADA-системы",
        name_en="SCADA System Installation and Configuration",
        short_description_uz="WinCC, Wonderware InTouch, Ignition SCADA platformalari bo'yicha to'liq xizmat.",
        short_description_ru="Полный комплекс услуг по платформам WinCC, Wonderware InTouch, Ignition SCADA.",
        short_description_en="Full service for WinCC, Wonderware InTouch, Ignition SCADA platforms.",
        description_uz=(
            "Real-vaqt monitoring ekranlarini yaratish, tarix arxivi sozlash, "
            "signalizatsiya va hodisalar jurnalini konfigurlash. OPC DA/UA ulanish."
        ),
        description_ru=(
            "Создание мнемосхем реального времени, настройка архива истории, "
            "конфигурирование журнала аварий и событий. Подключение OPC DA/UA."
        ),
        description_en=(
            "Creating real-time HMI screens, history archive configuration, "
            "alarm and event journal setup. OPC DA/UA connection."
        ),
        icon="monitor",
        order=2, is_active=True,
    ),
    dict(
        slug="instrumentation",
        division_slug="sensors-instruments",
        name_uz="Asbobsozlik va o'rnatish (КИПиА)",
        name_ru="Монтаж и наладка КИПиА",
        name_en="Instrumentation Installation and Commissioning",
        short_description_uz="Sanoat sensorlari va o'lchov asboblarini o'rnatish, sozlash va kalibrlash.",
        short_description_ru="Монтаж, настройка и калибровка промышленных датчиков и приборов.",
        short_description_en="Installation, calibration and commissioning of industrial sensors and instruments.",
        description_uz=(
            "Loyiha hujjatlari asosida montaj ishlari. Zaryadlash va sinovdan o'tkazish. "
            "SIL talablari bo'yicha xavfsizlik qurilmalarini o'rnatish. Kalibrlash sertifikatlari."
        ),
        description_ru=(
            "Монтажные работы на основе проектной документации. Наладка и тестирование. "
            "Установка защитных устройств в соответствии с требованиями SIL. Сертификаты калибровки."
        ),
        description_en=(
            "Commissioning works based on project documentation. Calibration and testing. "
            "Safety device installation per SIL requirements. Calibration certificates."
        ),
        icon="settings",
        order=1, is_active=True,
    ),
    dict(
        slug="panel-assembly",
        division_slug="electric-control",
        name_uz="Boshqaruv shkaflarini yig'ish",
        name_ru="Сборка щитов управления",
        name_en="Control Panel Assembly",
        short_description_uz="Individual loyiha asosida barcha turdagi boshqaruv shkaflarini professional yig'ish.",
        short_description_ru="Профессиональная сборка всех типов щитов управления по индивидуальному проекту.",
        short_description_en="Professional assembly of all types of control panels to individual design.",
        description_uz=(
            "MCC, VFD, PLC va boshqaruv shkaflarini loyihalash va yig'ish. "
            "Rittal, nVent Hoffman kabinetlari. DIN standartiga muvofiq montaj. "
            "Elektr chizmalar — EPLAN platformasi."
        ),
        description_ru=(
            "Проектирование и сборка шкафов МСС, ЧРП, ПЛК и управления. "
            "Шкафы Rittal, nVent Hoffman. Монтаж в соответствии со стандартом DIN. "
            "Электрические схемы на платформе EPLAN."
        ),
        description_en=(
            "Design and assembly of MCC, VFD, PLC and control panels. "
            "Rittal, nVent Hoffman enclosures. Installation per DIN standard. "
            "Electrical drawings on EPLAN platform."
        ),
        icon="server",
        order=1, is_active=True,
    ),
    dict(
        slug="maintenance",
        division_slug="maintenance-service",
        name_uz="Texnik xizmat ko'rsatish (TO)",
        name_ru="Техническое обслуживание (ТО)",
        name_en="Preventive Maintenance",
        short_description_uz="Rejalashtirilgan profilaktika — uskunalarning uzluksiz ishlashini ta'minlash.",
        short_description_ru="Плановая профилактика — обеспечение бесперебойной работы оборудования.",
        short_description_en="Scheduled preventive maintenance to ensure continuous equipment operation.",
        description_uz=(
            "Oylik, choraklik va yillik TO rejalari. Diagnostika va eskirish tahlili. "
            "Firmware yangilash, zaxira nusxalash, hujjatlashtirish. "
            "SLA shartnomalari — kafolatlangan javob vaqti."
        ),
        description_ru=(
            "Ежемесячные, квартальные и годовые планы ТО. Диагностика и анализ износа. "
            "Обновление прошивок, резервное копирование, документирование. "
            "Договора SLA — гарантированное время реагирования."
        ),
        description_en=(
            "Monthly, quarterly and annual maintenance plans. Diagnostics and wear analysis. "
            "Firmware updates, backup, documentation. "
            "SLA contracts — guaranteed response time."
        ),
        icon="tool",
        order=1, is_active=True,
    ),
    dict(
        slug="training",
        division_slug="maintenance-service",
        name_uz="Kadrlar tayyorlash va o'qitish",
        name_ru="Подготовка и обучение персонала",
        name_en="Personnel Training",
        short_description_uz="PLC/SCADA, sensorlar va boshqaruv tizimlari bo'yicha amaliy treninglar.",
        short_description_ru="Практические тренинги по ПЛК/SCADA, датчикам и системам управления.",
        short_description_en="Practical training on PLC/SCADA, sensors and control systems.",
        description_uz=(
            "Korxona xodimlari uchun boshlang'ich, o'rta va ilg'or darajali kurslar. "
            "Nazariya + amaliyot (real uskunalarda). Sertifikat beriladi."
        ),
        description_ru=(
            "Курсы начального, среднего и продвинутого уровня для сотрудников предприятий. "
            "Теория + практика (на реальном оборудовании). Выдача сертификата."
        ),
        description_en=(
            "Basic, intermediate and advanced level courses for enterprise staff. "
            "Theory + hands-on practice (on real equipment). Certificate issued."
        ),
        icon="graduation-cap",
        order=2, is_active=True,
    ),
]


def seed_services():
    from apps.divisions.models import Division
    slug_to_div = {d.slug: d for d in Division.objects.all()}
    created = 0
    for data in SERVICES:
        div_slug = data.pop("division_slug")
        data["division"] = slug_to_div.get(div_slug)
        _, is_new = Service.objects.update_or_create(slug=data["slug"], defaults=data)
        if is_new:
            created += 1
    return len(SERVICES), created
