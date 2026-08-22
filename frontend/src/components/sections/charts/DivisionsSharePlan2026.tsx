import { HeroShareDonut, type ShareSeg } from "./HeroShareDonut";

type Loc = Record<string, string>;
const t = (o: Loc, l: string) => o[l] ?? o.uz;

const HEADING: Loc = {
  uz: "2026-yilda «NKMK» AJ bo'linmalariga ishlab chiqarilishi rejalashtirilayotgan mahsulotlar ulushi",
  ru: "Планируемая доля продукции для подразделений АО «НКМК» в 2026 году",
  en: "Planned share of products for «NKMK» JSC divisions in 2026",
};
const UNIT: Loc = { uz: "mln so'm", ru: "млн сум", en: "mln UZS" };

const SEGS: { label: Loc; value: number; pct: string; rgb: string }[] = [
  { label: { uz: "Markaziy kon boshqarmasi", ru: "Центральное рудоуправление", en: "Central Mine Administration" }, value: 40100, pct: "50", rgb: "56,189,248" },
  { label: { uz: "Shimoliy kon boshqarmasi", ru: "Северное рудоуправление", en: "Northern Mine Administration" }, value: 8200, pct: "10", rgb: "139,92,246" },
  { label: { uz: "Janubiy kon boshqarmasi", ru: "Южное рудоуправление", en: "Southern Mine Administration" }, value: 10000, pct: "13", rgb: "245,158,11" },
  { label: { uz: "Qizilqum kon boshqarmasi", ru: "Кызылкумское рудоуправление", en: "Kyzylkum Mine Administration" }, value: 7800, pct: "10", rgb: "16,185,129" },
  { label: { uz: "Navoiy mashinasozlik zavodi", ru: "Навоийский машиностроительный завод", en: "Navoi Machine-Building Plant" }, value: 5000, pct: "6", rgb: "236,72,153" },
  { label: { uz: "Boshqa bo'linmalar", ru: "Прочие подразделения", en: "Other divisions" }, value: 8900, pct: "11", rgb: "59,130,246" },
];

export function DivisionsSharePlan2026({ locale }: { locale: string }) {
  const segments: ShareSeg[] = SEGS.map((s) => ({ ...s, label: t(s.label, locale) }));
  return <HeroShareDonut heading={t(HEADING, locale)} total={80000} unit={t(UNIT, locale)} segments={segments} />;
}
