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

interface Donut { title: string; total: number; segments: Seg[] }

const DONUTS: Donut[] = [
  {
    title: "Nostandart avtomatlashtirish vositalarini ishlab chiqarish, mahsulot va xizmatlarning yangi turlarini o'zlashtirish",
    total: 57000,
    segments: [
      { label: "Elektr shkaflar", value: 45324 },
      { label: "Yangi mahsulotlar", value: 10546 },
      { label: "Qo'shimcha", value: 780 },
      { label: "Polfabrikatlar", value: 350 },
    ],
  },
  {
    title: "Avtomatlashtirilgan elektr yuritmalar va elektroavtomatika bo'yicha sozlash ishlari, texnologik jarayonlar uchun dasturiy ta'minot",
    total: 9500,
    segments: [
      { label: "Avtomatlashtirish va sozlash", value: 5370 },
      { label: "Texnologik jarayonlarni avtomatlashtirilgan boshqaruv tizimlari dasturiy ta'minoti", value: 3230 },
      { label: "Texnologik ventilyatsiya, havoni konditsiyalash va sovitish qurilmalari tizimlarini sozlash", value: 900 },
    ],
  },
  {
    title: "O'lchash vositalarini ta'mirlash, kalibrlash va qiyoslash (tekshirish)",
    total: 11500,
    segments: [
      { label: "O'lchash vositalarini ta'mirlash", value: 5660 },
      { label: "Ishlab chiqarishning metrologik ta'minoti", value: 4617 },
      { label: "Ionlashtiruvchi nurlanishni o'lchash vositalarini ta'mirlash va qiyoslash", value: 1223 },
    ],
  },
  {
    title: "Qo'riqlash vositalari va avtomatik yong'in signalizatsiyasi tizimlarini texnik xizmat, o'rnatish va ta'mirlash",
    total: 4000,
    segments: [
      { label: "Qo'riqlash va yong'in signalizatsiyasi tizimlariga rejali texnik xizmat va profilaktik ta'mir", value: 2600 },
      { label: "Videokuzatuv tizimlarini rejali-profilaktik ta'mirlash va servis xizmati", value: 1400 },
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
        {DONUTS.map((d, i) => (
          <DonutChart key={i} title={d.title} total={d.total} unit={t(UNIT, locale)} segments={d.segments} />
        ))}
      </div>
    </section>
  );
}
