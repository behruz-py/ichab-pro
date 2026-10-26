import { HeroShareDonut, type ShareSeg } from "./HeroShareDonut";
import type { DivisionShare, Loc } from "@/types/internal";

const t = (o: Loc, l: string) => o[l] ?? o.uz;

const HEADING: Loc = {
  uz: "2026-yilda «NKMK» AJ bo'linmalariga ishlab chiqarilishi rejalashtirilayotgan mahsulotlar ulushi",
  ru: "Планируемая доля продукции для подразделений АО «НКМК» в 2026 году",
  en: "Planned share of products for «NKMK» JSC divisions in 2026",
};
const UNIT: Loc = { uz: "mln so'm", ru: "млн сум", en: "mln UZS" };

export function DivisionsSharePlan2026({ locale, data }: { locale: string; data: DivisionShare }) {
  const segments: ShareSeg[] = data.segments.map((s) => ({ ...s, label: t(s.label, locale) }));
  return <HeroShareDonut heading={t(HEADING, locale)} total={data.total} unit={t(UNIT, locale)} segments={segments} />;
}
