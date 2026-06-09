from apps.divisions.models import Division

DIVISIONS = [
    dict(
        slug="plc-scada",
        name_uz="PLC va SCADA tizimlari",
        name_ru="Системы ПЛК и SCADA",
        name_en="PLC and SCADA Systems",
        short_description_uz="Sanoat uchun dasturlanadigan mantiqiy kontrollerlar va dispetcherlik nazorat tizimlari.",
        short_description_ru="Программируемые логические контроллеры и SCADA-системы для промышленности.",
        short_description_en="Programmable logic controllers and SCADA supervisory systems for industry.",
        full_description_uz=(
            "Bizning PLC va SCADA bo'limimiz Siemens, Allen-Bradley, Schneider Electric kabi "
            "yetakchi ishlab chiqaruvchilarning eng zamonaviy qurilmalari bilan ishlaydi. "
            "Loyihalashtirish, o'rnatish va ishga tushirishdan tortib to texnik xizmat ko'rsatishgacha "
            "to'liq tsiklli xizmatlar taqdim etamiz."
        ),
        full_description_ru=(
            "Наш отдел ПЛК и SCADA работает с передовым оборудованием ведущих производителей. "
            "Предоставляем полный цикл услуг от проектирования и монтажа до технического обслуживания."
        ),
        full_description_en=(
            "Our PLC and SCADA division works with cutting-edge equipment from leading manufacturers. "
            "We provide full-cycle services from design and installation to maintenance."
        ),
        leader_name_uz="Sardor Xolmatov",
        leader_name_ru="Сардор Холматов",
        leader_name_en="Sardor Kholmatov",
        leader_position_uz="Bo'lim boshlig'i",
        leader_position_ru="Руководитель отдела",
        leader_position_en="Department Head",
        contact_phone="+998 71 200-01-01",
        contact_email="plc@ichab.uz",
        order=1,
        is_active=True,
    ),
    dict(
        slug="sensors-instruments",
        name_uz="Sanoat sensorlari va o'lchov asboblari",
        name_ru="Промышленные датчики и КИПиА",
        name_en="Industrial Sensors and Instrumentation",
        short_description_uz="Bosim, temperatura, daraja va oqim o'lchov asboblari — ishonchli va aniq.",
        short_description_ru="Приборы измерения давления, температуры, уровня и расхода — точно и надёжно.",
        short_description_en="Pressure, temperature, level and flow measurement instruments — precise and reliable.",
        full_description_uz=(
            "Endress+Hauser, Yokogawa, KROHNE va boshqa dunyoning top brendlari bilan hamkorlik. "
            "Har qanday sanoat sharoiti uchun moslashtirilgan o'lchov yechimlari."
        ),
        full_description_ru=(
            "Партнёрство с мировыми лидерами: Endress+Hauser, Yokogawa, KROHNE и другими. "
            "Адаптированные измерительные решения для любых промышленных условий."
        ),
        full_description_en=(
            "Partnership with world leaders: Endress+Hauser, Yokogawa, KROHNE and others. "
            "Customized measurement solutions for any industrial environment."
        ),
        leader_name_uz="Dilnoza Yusupova",
        leader_name_ru="Дилноза Юсупова",
        leader_name_en="Dilnoza Yusupova",
        leader_position_uz="Bosh muhandis",
        leader_position_ru="Главный инженер",
        leader_position_en="Chief Engineer",
        contact_phone="+998 71 200-01-02",
        contact_email="sensors@ichab.uz",
        order=2,
        is_active=True,
    ),
    dict(
        slug="electric-control",
        name_uz="Elektr qurilmalar va boshqaruv panellari",
        name_ru="Электрооборудование и щиты управления",
        name_en="Electrical Equipment and Control Panels",
        short_description_uz="Yuqori sifatli boshqaruv shkaflarini loyihalash, yig'ish va o'rnatish.",
        short_description_ru="Проектирование, сборка и монтаж высококачественных щитов управления.",
        short_description_en="Design, assembly and installation of high-quality control panels.",
        full_description_uz=(
            "ISO sertifikatlangan ishlab chiqarish sexida barcha turdagi boshqaruv shkaflarini "
            "individual loyiha asosida yig'amiz. ABB, Schneider Electric, Legrand komponentlari."
        ),
        full_description_ru=(
            "Сборка всех типов щитов управления на индивидуальный проект в ISO-сертифицированном цехе. "
            "Компоненты ABB, Schneider Electric, Legrand."
        ),
        full_description_en=(
            "Assembly of all types of control panels to individual design in our ISO-certified workshop. "
            "Components from ABB, Schneider Electric, Legrand."
        ),
        leader_name_uz="Bobur Rahimov",
        leader_name_ru="Бобур Рахимов",
        leader_name_en="Bobur Rakhimov",
        leader_position_uz="Loyiha muhandisi",
        leader_position_ru="Инженер-проектировщик",
        leader_position_en="Project Engineer",
        contact_phone="+998 71 200-01-03",
        contact_email="electric@ichab.uz",
        order=3,
        is_active=True,
    ),
    dict(
        slug="automation-projects",
        name_uz="Avtomatlashtirish loyihalari",
        name_ru="Проекты автоматизации",
        name_en="Automation Projects",
        short_description_uz="Korxonalarni to'liq avtomatlashtirish: texnologik jarayonlar, energiya, xavfsizlik.",
        short_description_ru="Полная автоматизация предприятий: технологические процессы, энергетика, безопасность.",
        short_description_en="Complete enterprise automation: technological processes, energy, safety systems.",
        full_description_uz=(
            "Amaliy tajribamiz asosida energetika, kimyo, oziq-ovqat va boshqa sohalarda "
            "kompleks avtomatlashtirish loyihalarini bajaramiz. Turn-key yechimlar."
        ),
        full_description_ru=(
            "На основе практического опыта реализуем комплексные проекты автоматизации "
            "в энергетике, химии, пищевой и других отраслях. Решения под ключ."
        ),
        full_description_en=(
            "Based on practical experience, we implement complex automation projects "
            "in energy, chemical, food and other industries. Turnkey solutions."
        ),
        leader_name_uz="Jasur Mirzayev",
        leader_name_ru="Джасур Мирзаев",
        leader_name_en="Jasur Mirzayev",
        leader_position_uz="Bosh loyiha menejeri",
        leader_position_ru="Главный менеджер проектов",
        leader_position_en="Chief Project Manager",
        contact_phone="+998 71 200-01-04",
        contact_email="projects@ichab.uz",
        order=4,
        is_active=True,
    ),
    dict(
        slug="maintenance-service",
        name_uz="Texnik xizmat va ta'mirlash",
        name_ru="Техническое обслуживание и ремонт",
        name_en="Maintenance and Repair",
        short_description_uz="24/7 texnik yordam, profilaktika va tezkor ta'mirlash xizmatlari.",
        short_description_ru="Техническая поддержка 24/7, профилактика и оперативный ремонт.",
        short_description_en="24/7 technical support, preventive maintenance and rapid repair services.",
        full_description_uz=(
            "Kafolat va kafolat muddatidan keyingi xizmat ko'rsatish. Zapasnoy qismlar ombori. "
            "Tezkor muhandislar guruhi — 4 soat ichida saytga yetib borish."
        ),
        full_description_ru=(
            "Гарантийное и постгарантийное обслуживание. Склад запасных частей. "
            "Оперативная выездная бригада — выезд на объект в течение 4 часов."
        ),
        full_description_en=(
            "Warranty and post-warranty service. Spare parts warehouse. "
            "Rapid response team — on-site arrival within 4 hours."
        ),
        leader_name_uz="Alisher Toshmatov",
        leader_name_ru="Алишер Тошматов",
        leader_name_en="Alisher Toshmatov",
        leader_position_uz="Xizmat ko'rsatish bo'limi boshlig'i",
        leader_position_ru="Руководитель сервисного отдела",
        leader_position_en="Service Department Head",
        contact_phone="+998 71 200-01-05",
        contact_email="service@ichab.uz",
        order=5,
        is_active=True,
    ),
]


def seed_divisions():
    created = 0
    for data in DIVISIONS:
        _, is_new = Division.objects.update_or_create(slug=data["slug"], defaults=data)
        if is_new:
            created += 1
    return len(DIVISIONS), created
