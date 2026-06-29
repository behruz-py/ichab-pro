import { HeroShareDonut, type ShareSeg } from "./HeroShareDonut";

type Loc = Record<string, string>;
const t = (o: Loc, l: string) => o[l] ?? o.uz;

const HEADING: Loc = {
  uz: "2026-yilda «NKMK» AJ bo'linmalariga ishlab chiqarilishi rejalashtirilayotgan mahsulotlar ulushi",
  ru: "Планируемая доля продукции для подразделений АО «НКМК» в 2026 году",
  en: "Planned share of products for «NKMK» JSC divisions in 2026",
};
const UNIT: Loc = { uz: "mln so'm", ru: "млн сум", en: "mln UZS" };

const SEGS: ShareSeg[] = [
  { label: "Markaziy kon boshqarmasi", value: 40100, pct: "50", rgb: "56,189,248" },
  { label: "Shimoliy kon boshqarmasi", value: 8200, pct: "10", rgb: "139,92,246" },
  { label: "Janubiy kon boshqarmasi", value: 10000, pct: "13", rgb: "245,158,11" },
  { label: "Qizilqum kon boshqarmasi", value: 7800, pct: "10", rgb: "16,185,129" },
  { label: "Navoiy mashinasozlik zavodi", value: 5000, pct: "6", rgb: "236,72,153" },
  { label: "Boshqa bo'linmalar", value: 8900, pct: "11", rgb: "59,130,246" },
];

export function DivisionsSharePlan2026({ locale }: { locale: string }) {
  return <HeroShareDonut heading={t(HEADING, locale)} total={80000} unit={t(UNIT, locale)} segments={SEGS} />;
}
