import { HeroShareDonut, type ShareSeg } from "./HeroShareDonut";
import type { DivisionShare, Loc } from "@/types/internal";

const t = (o: Loc, l: string) => o[l] ?? o.uz;

const HEADING: Loc = {
  uz: "2025-yilda «NKMK» AJ bo'linmalariga ishlab chiqarilgan mahsulotlar ulushi",
  ru: "Доля продукции, произведённой для подразделений АО «НКМК» в 2025 году",
  en: "Share of products manufactured for «NKMK» JSC divisions in 2025",
};
const UNIT: Loc = { uz: "mln so'm", ru: "млн сум", en: "mln UZS" };

export function DivisionsShare2025({ locale, data }: { locale: string; data: DivisionShare }) {
  const segments: ShareSeg[] = data.segments.map((s) => ({ ...s, label: t(s.label, locale) }));
  return <HeroShareDonut heading={t(HEADING, locale)} total={data.total} unit={t(UNIT, locale)} segments={segments} />;
}
