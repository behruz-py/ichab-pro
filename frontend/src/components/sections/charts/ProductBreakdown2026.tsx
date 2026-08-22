import { DonutChart, type Seg } from "./DonutChart";

type Loc = Record<string, string>;
const t = (o: Loc, l: string) => o[l] ?? o.uz;

const HEADING: Loc = {
  uz: "2026-yilga mahsulot, ishlar va xizmatlar ishlab chiqarish hajmi",
  ru: "Объём производства продукции, работ и услуг на 2026 год",
  en: "2026 production plan for products, works and services",
};
const SUBHEAD: Loc = {
  uz: "IChAB NO'A va AML bo'yicha yo'nalishlar kesimida",
  ru: "По направлениям (ИЧАБ NO'A и AML)",
  en: "By direction (IChAB NO'A & AML)",
};
const UNIT: Loc = { uz: "mln so'm", ru: "млн сум", en: "mln UZS" };

interface DonutSeg { label: Loc; value: number }
interface Donut { title: Loc; total: number; segments: DonutSeg[] }

const DONUTS: Donut[] = [
  {
    title: {
      uz: "Nostandart avtomatlashtirish vositalarini ishlab chiqarish, mahsulot va xizmatlarning yangi turlarini o'zlashtirish",
      ru: "Производство нестандартных средств автоматизации, освоение новых видов продукции и услуг",
      en: "Manufacturing non-standard automation equipment, mastering new products and services",
    },
    total: 57000,
    segments: [
      { label: { uz: "Elektr shkaflar", ru: "Электрошкафы", en: "Electrical cabinets" }, value: 45324 },
      { label: { uz: "Yangi mahsulotlar", ru: "Новая продукция", en: "New products" }, value: 10546 },
      { label: { uz: "Qo'shimcha", ru: "Дополнительно", en: "Additional" }, value: 780 },
      { label: { uz: "Polfabrikatlar", ru: "Полуфабрикаты", en: "Semi-finished goods" }, value: 350 },
    ],
  },
  {
    title: {
      uz: "Avtomatlashtirilgan elektr yuritmalar va elektroavtomatika bo'yicha sozlash ishlari, texnologik jarayonlar uchun dasturiy ta'minot",
      ru: "Наладка автоматизированных электроприводов и электроавтоматики, программное обеспечение технологических процессов",
      en: "Commissioning of automated electric drives and electro-automation, software for technological processes",
    },
    total: 9500,
    segments: [
      { label: { uz: "Avtomatlashtirish va sozlash", ru: "Автоматизация и наладка", en: "Automation and commissioning" }, value: 5370 },
      { label: { uz: "Texnologik jarayonlarni avtomatlashtirilgan boshqaruv tizimlari dasturiy ta'minoti", ru: "Программное обеспечение АСУ ТП", en: "Software for automated process control systems" }, value: 3230 },
      { label: { uz: "Texnologik ventilyatsiya, havoni konditsiyalash va sovitish qurilmalari tizimlarini sozlash", ru: "Наладка систем технологической вентиляции, кондиционирования и охлаждения", en: "Commissioning of process ventilation, air conditioning and cooling systems" }, value: 900 },
    ],
  },
  {
    title: {
      uz: "O'lchash vositalarini ta'mirlash, kalibrlash va qiyoslash (tekshirish)",
      ru: "Ремонт, калибровка и поверка средств измерений",
      en: "Repair, calibration and verification of measuring instruments",
    },
    total: 11500,
    segments: [
      { label: { uz: "O'lchash vositalarini ta'mirlash", ru: "Ремонт средств измерений", en: "Repair of measuring instruments" }, value: 5660 },
      { label: { uz: "Ishlab chiqarishning metrologik ta'minoti", ru: "Метрологическое обеспечение производства", en: "Metrological support of production" }, value: 4617 },
      { label: { uz: "Ionlashtiruvchi nurlanishni o'lchash vositalarini ta'mirlash va qiyoslash", ru: "Ремонт и поверка средств измерений ионизирующих излучений", en: "Repair and verification of ionizing radiation measuring instruments" }, value: 1223 },
    ],
  },
  {
    title: {
      uz: "Qo'riqlash vositalari va avtomatik yong'in signalizatsiyasi tizimlarini texnik xizmat, o'rnatish va ta'mirlash",
      ru: "Техническое обслуживание, монтаж и ремонт систем охраны и автоматической пожарной сигнализации",
      en: "Maintenance, installation and repair of security and automatic fire alarm systems",
    },
    total: 4000,
    segments: [
      { label: { uz: "Qo'riqlash va yong'in signalizatsiyasi tizimlariga rejali texnik xizmat va profilaktik ta'mir", ru: "Плановое техобслуживание и профилактический ремонт систем охранно-пожарной сигнализации", en: "Scheduled maintenance and preventive repair of security & fire alarm systems" }, value: 2600 },
      { label: { uz: "Videokuzatuv tizimlarini rejali-profilaktik ta'mirlash va servis xizmati", ru: "Планово-профилактический ремонт и сервис систем видеонаблюдения", en: "Scheduled preventive repair and service of video surveillance systems" }, value: 1400 },
    ],
  },
];

export function ProductBreakdown2026({ locale }: { locale: string }) {
  return (
    <section>
      <div className="mb-6">
        <h3 className="font-display font-bold text-content" style={{ fontSize: "clamp(20px,2.4vw,28px)" }}>{t(HEADING, locale)}</h3>
        <p className="mt-1.5 text-sm" style={{ color: "var(--content-secondary)" }}>{t(SUBHEAD, locale)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {DONUTS.map((d, i) => {
          const segments: Seg[] = d.segments.map((s) => ({ label: t(s.label, locale), value: s.value }));
          return (
            <DonutChart key={i} title={t(d.title, locale)} total={d.total} unit={t(UNIT, locale)} segments={segments} />
          );
        })}
      </div>
    </section>
  );
}
