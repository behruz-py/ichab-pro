import { DonutChart, type Seg } from "./DonutChart";

type Loc = Record<string, string>;
const t = (o: Loc, l: string) => o[l] ?? o.uz;

const HEADING: Loc = {
  uz: "2025-yilda «NKMK» AJ bo'linmalariga ishlab chiqarilgan mahsulotlar ulushi",
  ru: "Доля продукции, произведённой для подразделений АО «НКМК» в 2025 году",
  en: "Share of products manufactured for «NKMK» JSC divisions in 2025",
};
const UNIT: Loc = { uz: "mln so'm", ru: "млн сум", en: "mln UZS" };

const SEGS: Seg[] = [
  { label: "Markaziy kon boshqarmasi", value: 30568, pctLabel: "38" },
  { label: "Shimoliy kon boshqarmasi", value: 30997, pctLabel: "39" },
  { label: "Janubiy kon boshqarmasi", value: 4993, pctLabel: "6.2" },
  { label: "Qizilqum kon boshqarmasi", value: 4090, pctLabel: "5.1" },
  { label: "Navoiy mashinasozlik zavodi", value: 1493, pctLabel: "1.8" },
  { label: "Boshqa bo'linmalar", value: 7359, pctLabel: "9.2" },
];

export function DivisionsShare2025({ locale }: { locale: string }) {
  return (
    <section>
      <div className="mb-6">
        <h3 className="font-display font-bold text-content leading-snug" style={{ fontSize: "clamp(19px,2.3vw,26px)" }}>{t(HEADING, locale)}</h3>
      </div>
      <div className="max-w-md mx-auto">
        <DonutChart title="" total={79500} unit={t(UNIT, locale)} segments={SEGS} showPct />
      </div>
    </section>
  );
}
