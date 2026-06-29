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
const SEGS: ShareSeg[] = [
  { label: "Markaziy kon boshqarmasi", value: 30568, pct: "38", rgb: "56,189,248" },
  { label: "Shimoliy kon boshqarmasi", value: 30997, pct: "39", rgb: "139,92,246" },
  { label: "Janubiy kon boshqarmasi", value: 4993, pct: "6.2", rgb: "245,158,11" },
  { label: "Qizilqum kon boshqarmasi", value: 4090, pct: "5.1", rgb: "16,185,129" },
  { label: "Navoiy mashinasozlik zavodi", value: 1493, pct: "1.8", rgb: "236,72,153" },
  { label: "Boshqa bo'linmalar", value: 7359, pct: "9.2", rgb: "59,130,246" },
];

export function DivisionsShare2025({ locale }: { locale: string }) {
  return <HeroShareDonut heading={t(HEADING, locale)} total={79500} unit={t(UNIT, locale)} segments={SEGS} />;
}
