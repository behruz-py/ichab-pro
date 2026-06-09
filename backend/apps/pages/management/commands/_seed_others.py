import datetime
from apps.certificates.models import Certificate
from apps.partners.models import Partner
from apps.projects.models import Project
from apps.stats.models import Statistic
from apps.pages.models import PageContent


def seed_certificates():
    data_list = [
        dict(name_uz="ISO 9001:2015 — Sifat menejmenti tizimi",
             name_ru="ISO 9001:2015 — Система менеджмента качества",
             name_en="ISO 9001:2015 — Quality Management System",
             issuing_organization_uz="Bureau Veritas Certification",
             issuing_organization_ru="Bureau Veritas Certification",
             issuing_organization_en="Bureau Veritas Certification",
             issued_date=datetime.date(2022, 3, 15),
             expiry_date=datetime.date(2025, 3, 14),
             is_international=True, order=1, is_active=True),
        dict(name_uz="ISO 14001:2015 — Atrof-muhit menejmenti",
             name_ru="ISO 14001:2015 — Система экологического менеджмента",
             name_en="ISO 14001:2015 — Environmental Management System",
             issuing_organization_uz="TÜV Rheinland",
             issuing_organization_ru="TÜV Rheinland",
             issuing_organization_en="TÜV Rheinland",
             issued_date=datetime.date(2022, 5, 20),
             expiry_date=datetime.date(2025, 5, 19),
             is_international=True, order=2, is_active=True),
        dict(name_uz="O'zbekiston Davlat Sertifikati — Elektr qurilmalar",
             name_ru="Государственный сертификат Узбекистана — Электрооборудование",
             name_en="Uzbekistan State Certificate — Electrical Equipment",
             issuing_organization_uz="O'zstandart agentligi",
             issuing_organization_ru="Агентство Узстандарт",
             issuing_organization_en="Uzstandart Agency",
             issued_date=datetime.date(2023, 1, 10),
             is_international=False, order=3, is_active=True),
        dict(name_uz="Siemens Solution Partner — Sertifikatlangan sherik",
             name_ru="Siemens Solution Partner — Сертифицированный партнёр",
             name_en="Siemens Solution Partner — Certified Partner",
             issuing_organization_uz="Siemens AG",
             issuing_organization_ru="Siemens AG",
             issuing_organization_en="Siemens AG",
             issued_date=datetime.date(2021, 6, 1),
             is_international=True, order=4, is_active=True),
    ]
    created = 0
    for data in data_list:
        _, is_new = Certificate.objects.update_or_create(
            name_uz=data["name_uz"], defaults=data
        )
        if is_new:
            created += 1
    return len(data_list), created


def seed_partners():
    data_list = [
        dict(name_uz="Siemens", name_ru="Siemens", name_en="Siemens",
             description_uz="Germaniyaning yetakchi sanoat avtomatizatsiyasi kompaniyasi.",
             description_ru="Ведущая немецкая компания в области промышленной автоматизации.",
             description_en="Germany's leading industrial automation company.",
             website="https://www.siemens.com", is_featured=True, order=1, is_active=True),
        dict(name_uz="ABB", name_ru="ABB", name_en="ABB",
             description_uz="Elektr va avtomatizatsiya texnologiyalari bo'yicha global lider.",
             description_ru="Глобальный лидер в области электрических и автоматизационных технологий.",
             description_en="Global leader in electrical and automation technologies.",
             website="https://www.abb.com", is_featured=True, order=2, is_active=True),
        dict(name_uz="Schneider Electric", name_ru="Schneider Electric", name_en="Schneider Electric",
             description_uz="Energiya menejmenti va avtomatizatsiyada innovatsion echimlar.",
             description_ru="Инновационные решения в области управления энергией и автоматизации.",
             description_en="Innovative solutions in energy management and automation.",
             website="https://www.se.com", is_featured=True, order=3, is_active=True),
        dict(name_uz="Endress+Hauser", name_ru="Endress+Hauser", name_en="Endress+Hauser",
             description_uz="Jarayon o'lchash va avtomatlashtirish sohasidagi jahon yetakchisi.",
             description_ru="Мировой лидер в области измерений и автоматизации процессов.",
             description_en="World leader in process measurement and automation.",
             website="https://www.endress.com", is_featured=True, order=4, is_active=True),
        dict(name_uz="Yokogawa", name_ru="Yokogawa", name_en="Yokogawa",
             description_uz="Sanoat avtomatizatsiyasi va o'lchov asboblarida Yaponiya brendi.",
             description_ru="Японский бренд в области промышленной автоматизации и измерительных приборов.",
             description_en="Japanese brand in industrial automation and measurement instruments.",
             website="https://www.yokogawa.com", is_featured=False, order=5, is_active=True),
        dict(name_uz="Honeywell", name_ru="Honeywell", name_en="Honeywell",
             description_uz="DCS va xavfsizlik tizimlari bo'yicha yetakchi global ishlab chiqaruvchi.",
             description_ru="Ведущий мировой производитель DCS и систем безопасности.",
             description_en="Leading global manufacturer of DCS and safety systems.",
             website="https://www.honeywell.com", is_featured=False, order=6, is_active=True),
    ]
    created = 0
    for data in data_list:
        _, is_new = Partner.objects.update_or_create(
            name_uz=data["name_uz"], defaults=data
        )
        if is_new:
            created += 1
    return len(data_list), created


def seed_projects():
    from apps.divisions.models import Division
    div_map = {d.slug: d for d in Division.objects.all()}
    data_list = [
        dict(slug="navoiy-kimyo",
             division=div_map.get("automation-projects"),
             name_uz="Navoiy kimyo zavodi — Avtomatlashtirish",
             name_ru="Навоийский химический завод — Автоматизация",
             name_en="Navoiy Chemical Plant — Automation",
             client_uz="Navoiy kimyo kombinati", client_ru="Навоийский горно-химический комбинат",
             client_en="Navoiy Mining and Chemical Complex",
             description_uz="Reaktorlar va distillyatsiya jarayonlarini PLC/SCADA tizimi orqali to'liq avtomatlashtirish.",
             description_ru="Полная автоматизация реакторов и процессов дистилляции через систему ПЛК/SCADA.",
             description_en="Full automation of reactors and distillation processes via PLC/SCADA system.",
             result_uz="Mahsuldorlik 23% oshdi, xodimlar xarajati 40% kamaydi.",
             result_ru="Производительность выросла на 23%, затраты на персонал снижены на 40%.",
             result_en="Productivity increased by 23%, staffing costs reduced by 40%.",
             location_uz="Navoiy viloyati, O'zbekiston",
             location_ru="Навоийская область, Узбекистан",
             location_en="Navoiy Region, Uzbekistan",
             completed_date=datetime.date(2023, 8, 15),
             order=1, is_active=True),
        dict(slug="toshkent-issiqlik",
             division=div_map.get("plc-scada"),
             name_uz="Toshkent issiqlik elektr stantsiyasi — SCADA",
             name_ru="Ташкентская ТЭЦ — SCADA-система",
             name_en="Tashkent Heat Power Plant — SCADA",
             client_uz="O'zbekenergo", client_ru="Узбекэнерго", client_en="Uzbekenergo",
             description_uz="Qozonlar, turbinalar va elektr taqsimot tizimlarini boshqarish uchun SCADA platforma.",
             description_ru="SCADA-платформа для управления котлами, турбинами и системами электрораспределения.",
             description_en="SCADA platform for managing boilers, turbines and power distribution systems.",
             result_uz="Avariyalar soni 60% kamaydi. Energiya yo'qotishlari 15% qisqardi.",
             result_ru="Количество аварий снижено на 60%. Потери энергии сокращены на 15%.",
             result_en="Accident rate reduced by 60%. Energy losses cut by 15%.",
             location_uz="Toshkent shahri", location_ru="г. Ташкент", location_en="Tashkent city",
             completed_date=datetime.date(2022, 11, 30),
             order=2, is_active=True),
        dict(slug="fargona-neft",
             division=div_map.get("sensors-instruments"),
             name_uz="Farg'ona neftni qayta ishlash zavodi — KIPiA",
             name_ru="Ферганский НПЗ — Модернизация КИПиА",
             name_en="Fergana Oil Refinery — Instrumentation Upgrade",
             client_uz="O'zneftgaz", client_ru="Узнефтегаз", client_en="Uzneftegaz",
             description_uz="Eskirgan asbob-uskunalarni zamonaviy smart transmitterlar bilan almashtirish.",
             description_ru="Замена устаревших приборов современными интеллектуальными датчиками.",
             description_en="Replacement of obsolete instruments with modern smart transmitters.",
             result_uz="O'lchov aniqligi 5 baravar oshdi. HART tarmog'i orqali markaziy monitoring.",
             result_ru="Точность измерений повышена в 5 раз. Централизованный мониторинг через сеть HART.",
             result_en="Measurement accuracy improved 5x. Centralized monitoring via HART network.",
             location_uz="Farg'ona viloyati", location_ru="Ферганская область", location_en="Fergana Region",
             completed_date=datetime.date(2023, 4, 10),
             order=3, is_active=True),
        dict(slug="samarqand-sement",
             division=div_map.get("electric-control"),
             name_uz="Samarqand sement zavodi — Elektr shkaflar",
             name_ru="Самаркандский цементный завод — Электрощиты",
             name_en="Samarkand Cement Plant — Control Panels",
             client_uz="Samarqandsement", client_ru="Самаркандцемент", client_en="Samarkandsement",
             description_uz="30 ta MCC va boshqaruv shkafini loyihalash, yig'ish va o'rnatish.",
             description_ru="Проектирование, сборка и монтаж 30 шкафов МСС и управления.",
             description_en="Design, assembly and installation of 30 MCC and control panels.",
             result_uz="Ishga tushirish vaqti 35% qisqardi. Standart yechimga nisbatan 20% tejam.",
             result_ru="Время ввода в эксплуатацию сокращено на 35%. Экономия 20% по сравнению со стандартным решением.",
             result_en="Commissioning time reduced by 35%. 20% savings vs standard solution.",
             location_uz="Samarqand viloyati", location_ru="Самаркандская область", location_en="Samarkand Region",
             completed_date=datetime.date(2024, 1, 20),
             order=4, is_active=True),
    ]
    created = 0
    for data in data_list:
        _, is_new = Project.objects.update_or_create(slug=data["slug"], defaults=data)
        if is_new:
            created += 1
    return len(data_list), created


def seed_stats():
    data_list = [
        dict(label_uz="Bajarilgan loyihalar", label_ru="Выполненных проектов",
             label_en="Completed projects", value=280, suffix_uz="+", suffix_ru="+",
             suffix_en="+", icon="folder-check", order=1, is_active=True),
        dict(label_uz="Yillik tajriba", label_ru="Лет опыта", label_en="Years of experience",
             value=15, suffix_uz="+", suffix_ru="+", suffix_en="+",
             icon="calendar", order=2, is_active=True),
        dict(label_uz="Doimiy mijozlar", label_ru="Постоянных клиентов",
             label_en="Regular clients", value=500, suffix_uz="+", suffix_ru="+",
             suffix_en="+", icon="users", order=3, is_active=True),
        dict(label_uz="Mutaxassislar", label_ru="Специалистов", label_en="Specialists",
             value=60, suffix_uz="+", suffix_ru="+", suffix_en="+",
             icon="hard-hat", order=4, is_active=True),
    ]
    created = 0
    for data in data_list:
        _, is_new = Statistic.objects.update_or_create(
            label_uz=data["label_uz"], defaults=data
        )
        if is_new:
            created += 1
    return len(data_list), created


def seed_pages():
    data_list = [
        dict(key="home_intro",
             title_uz="O'zbekistonning yetakchi sanoat avtomatizatsiya kompaniyasi",
             title_ru="Ведущая компания промышленной автоматизации Узбекистана",
             title_en="Uzbekistan's Leading Industrial Automation Company",
             subtitle_uz="PLC, SCADA, sensorlar va boshqaruv tizimlari — turnkey yechimlar.",
             subtitle_ru="ПЛК, SCADA, датчики и системы управления — решения под ключ.",
             subtitle_en="PLC, SCADA, sensors and control systems — turnkey solutions.",
             order=1, is_active=True),
        dict(key="about_mission",
             title_uz="Bizning missiyamiz",
             title_ru="Наша миссия",
             title_en="Our Mission",
             body_uz=(
                 "O'zbekiston sanoatini xalqaro standartlarga mos zamonaviy avtomatizatsiya "
                 "yechimlari bilan ta'minlash, ishlab chiqarish samaradorligini oshirish va "
                 "mijozlarning raqobatbardoshligini kuchaytirish."
             ),
             body_ru=(
                 "Обеспечение промышленности Узбекистана современными решениями автоматизации "
                 "мирового уровня, повышение эффективности производства и конкурентоспособности клиентов."
             ),
             body_en=(
                 "Providing Uzbekistan's industry with world-class automation solutions, "
                 "improving production efficiency and enhancing client competitiveness."
             ),
             order=2, is_active=True),
        dict(key="about_vision",
             title_uz="Bizning vazifamiz (vision)",
             title_ru="Наше видение",
             title_en="Our Vision",
             body_uz=(
                 "2030 yilga kelib Markaziy Osiyoning eng yirik sanoat avtomatizatsiyasi "
                 "markazi bo'lish va mintaqa korxonalarini raqamli transformatsiyada yetakchiligi."
             ),
             body_ru=(
                 "К 2030 году стать крупнейшим центром промышленной автоматизации в Центральной Азии "
                 "и возглавить цифровую трансформацию предприятий региона."
             ),
             body_en=(
                 "By 2030, become the largest industrial automation center in Central Asia "
                 "and lead the digital transformation of regional enterprises."
             ),
             order=3, is_active=True),
        dict(key="about_history",
             title_uz="Korporatsiya tarixi",
             title_ru="История корпорации",
             title_en="Company History",
             body_uz=(
                 "2009 yilda Toshkentda tashkil etilgan ICHAB bugungi kunda O'zbekiston va Markaziy "
                 "Osiyoning eng yirik sanoat avtomatizatsiyasi kompaniyalaridan biriga aylandi. "
                 "15 yil davomida 280 dan ortiq yirik loyiha muvaffaqiyatli bajarildi."
             ),
             body_ru=(
                 "Основанная в 2009 году в Ташкенте, ICHAB сегодня является одной из крупнейших "
                 "компаний промышленной автоматизации в Узбекистане и Центральной Азии. "
                 "За 15 лет успешно реализовано более 280 крупных проектов."
             ),
             body_en=(
                 "Founded in Tashkent in 2009, ICHAB has grown into one of the largest "
                 "industrial automation companies in Uzbekistan and Central Asia. "
                 "Over 15 years, more than 280 major projects have been successfully completed."
             ),
             order=4, is_active=True),
        dict(key="home_cta",
             title_uz="Loyihangizni muhokama qilishga tayyormisiz?",
             title_ru="Готовы обсудить ваш проект?",
             title_en="Ready to discuss your project?",
             subtitle_uz="Bepul konsultatsiya uchun hoziroq murojaat qiling.",
             subtitle_ru="Свяжитесь с нами прямо сейчас для бесплатной консультации.",
             subtitle_en="Contact us right now for a free consultation.",
             order=5, is_active=True),
    ]
    created = 0
    for data in data_list:
        _, is_new = PageContent.objects.update_or_create(key=data["key"], defaults=data)
        if is_new:
            created += 1
    return len(data_list), created
