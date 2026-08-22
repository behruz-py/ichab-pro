import { HeroShareDonut, type ShareSeg } from "./HeroShareDonut";

type Loc = Record<string, string>;
const t = (o: Loc, l: string) => o[l] ?? o.uz;

const HEADING: Loc = {
  uz: "2025-yilda «NKMK» AJ bo'linmalariga ishlab chiqarilgan mahsulotlar ulushi",
  ru: "Доля продукции, произведённой для подразделений АО «НКМК» в 2025 году",
  en: "Share of products manufactured for «NKMK» JSC divisions in 2025",
};
const UNIT: Loc = { uz: "mln so'm", ru: "млн сум", en: "mln UZS" };

// Division → fixed colour (shared with the 2026 plan chart for consistency)
const SEGS: { label: Loc; value: number; pct: string; rgb: string }[] = [
  { label: { uz: "Markaziy kon boshqarmasi", ru: "Центральное рудоуправление", en: "Central Mine Administration" }, value: 30568, pct: "38", rgb: "56,189,248" },
  { label: { uz: "Shimoliy kon boshqarmasi", ru: "Северное рудоуправление", en: "Northern Mine Administration" }, value: 30997, pct: "39", rgb: "139,92,246" },
  { label: { uz: "Janubiy kon boshqarmasi", ru: "Южное рудоуправление", en: "Southern Mine Administration" }, value: 4993, pct: "6.2", rgb: "245,158,11" },
  { label: { uz: "Qizilqum kon boshqarmasi", ru: "Кызылкумское рудоуправление", en: "Kyzylkum Mine Administration" }, value: 4090, pct: "5.1", rgb: "16,185,129" },
  { label: { uz: "Navoiy mashinasozlik zavodi", ru: "Навоийский машиностроительный завод", en: "Navoi Machine-Building Plant" }, value: 1493, pct: "1.8", rgb: "236,72,153" },
  { label: { uz: "Boshqa bo'linmalar", ru: "Прочие подразделения", en: "Other divisions" }, value: 7359, pct: "9.2", rgb: "59,130,246" },
];

export function DivisionsShare2025({ locale }: { locale: string }) {
  const segments: ShareSeg[] = SEGS.map((s) => ({ ...s, label: t(s.label, locale) }));
  return <HeroShareDonut heading={t(HEADING, locale)} total={79500} unit={t(UNIT, locale)} segments={segments} />;
}
