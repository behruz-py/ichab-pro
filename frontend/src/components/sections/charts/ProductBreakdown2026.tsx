import { DonutChart, type Seg } from "./DonutChart";
import type { BreakdownDonut, Loc } from "@/types/internal";

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

export function ProductBreakdown2026({ locale, data }: { locale: string; data: BreakdownDonut[] }) {
  return (
    <section>
      <div className="mb-6">
        <h3 className="font-display font-bold text-content" style={{ fontSize: "clamp(20px,2.4vw,28px)" }}>{t(HEADING, locale)}</h3>
        <p className="mt-1.5 text-sm" style={{ color: "var(--content-secondary)" }}>{t(SUBHEAD, locale)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {data.map((d, i) => {
          const segments: Seg[] = d.segments.map((s) => ({ label: t(s.label, locale), value: s.value }));
          return (
            <DonutChart key={i} title={t(d.title, locale)} total={d.total} unit={t(UNIT, locale)} segments={segments} />
          );
        })}
      </div>
    </section>
  );
}
