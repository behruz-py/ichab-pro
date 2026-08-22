"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

type Loc = Record<string, string>;
const t = (o: Loc, l: string) => o[l] ?? o.uz;

const HEADING: Loc = {
  uz: "ICHAB ning 2024–2025 yillar davomida asosiy ko'rsatkichlarini bajarilishi",
  ru: "Выполнение основных показателей ICHAB за 2024–2025 годы",
  en: "ICHAB key indicators performance over 2024–2025",
};
const C_NAME: Loc = { uz: "Ko'rsatkichlar", ru: "Показатели", en: "Indicators" };
const C_UNIT: Loc = { uz: "O'lchov birligi", ru: "Ед. изм.", en: "Unit" };
const C_2024: Loc = { uz: "2024-yil", ru: "2024 год", en: "2024" };
const C_2025: Loc = { uz: "2025-yil", ru: "2025 год", en: "2025" };
const C_DIFF: Loc = { uz: "2025-yilning 2024-yilga nisbatan (+, -)", ru: "2025 к 2024 (+, -)", en: "2025 vs 2024 (+, -)" };
const C_PCT: Loc = { uz: "2025-yilning 2024-yilga nisbatan %", ru: "2025 к 2024 %", en: "2025 vs 2024 %" };

interface Row { name: Loc; unit: Loc; v2024: string; v2025: string; change: string; pct?: string; level: number }

const U_SUM: Loc = { uz: "mln so'm", ru: "млн сум", en: "mln UZS" };
const U_PERSON: Loc = { uz: "odam", ru: "чел.", en: "people" };
const U_SUM_PERSON: Loc = { uz: "mln so'm/odam", ru: "млн сум/чел.", en: "mln UZS/person" };

const ROWS: Row[] = [
  { name: { uz: "Yalpi mahsulot hajmi, jami:", ru: "Объём валовой продукции, всего:", en: "Total gross output:" }, unit: U_SUM, v2024: "53 748", v2025: "81 000", change: "27 252", pct: "151", level: 0 },
  { name: { uz: "shu jumladan: Avtomatlashtirilgan nostandart vositalarni tayyorlash", ru: "в т.ч.: изготовление нестандартных средств автоматизации", en: "incl.: manufacture of non-standard automation equipment" }, unit: U_SUM, v2024: "28 673", v2025: "47 500", change: "18 827", pct: "165.7", level: 1 },
  { name: { uz: "ICHAB tarkibiy bo'linmalari tomonidan bajariladigan ishlar (xizmatlar) hajmi", ru: "Объём работ (услуг), выполняемых структурными подразделениями ICHAB", en: "Volume of works (services) performed by ICHAB's structural units" }, unit: U_SUM, v2024: "20 144", v2025: "23 629", change: "3 485", pct: "117.3", level: 2 },
  { name: { uz: "yangi turdagi mahsulotlar va xizmatlarni o'zlashtirish", ru: "освоение новых видов продукции и услуг", en: "development of new types of products and services" }, unit: U_SUM, v2024: "4 931", v2025: "9 871", change: "4 940", pct: "200.2", level: 1 },
  { name: { uz: "tovar mahsuloti", ru: "товарная продукция", en: "marketable output" }, unit: U_SUM, v2024: "488", v2025: "552", change: "64", pct: "113", level: 0 },
  { name: { uz: "O'rtacha ro'yxatdagi xodimlar soni, jami", ru: "Среднесписочная численность работников, всего", en: "Average headcount, total" }, unit: U_PERSON, v2024: "153", v2025: "152", change: "-1", pct: "99", level: 0 },
  { name: { uz: "Boshqaruv xodimlari soni", ru: "Численность управленческого персонала", en: "Management staff headcount" }, unit: U_PERSON, v2024: "22", v2025: "22", change: "0", level: 0 },
  { name: { uz: "Mehnat unumdorligi", ru: "Производительность труда", en: "Labor productivity" }, unit: U_SUM_PERSON, v2024: "351,3", v2025: "532,9", change: "181,6", pct: "152", level: 0 },
  { name: { uz: "ICHAB ni saqlash smetasi", ru: "Смета содержания ICHAB", en: "ICHAB maintenance budget" }, unit: U_SUM, v2024: "51 707", v2025: "90 200", change: "27 693", pct: "137", level: 0 },
];

const changeColor = (c: string) => (c.startsWith("-") ? "rgb(248,113,113)" : c === "0" ? "var(--content-muted)" : "rgb(52,211,153)");

export function MainIndicatorsTable({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const cellBorder = "1px solid var(--border-subtle)";

  return (
    <section ref={ref}>
      <div className="mb-6">
        <h3 className="font-display font-bold text-content leading-snug" style={{ fontSize: "clamp(19px,2.3vw,26px)" }}>{t(HEADING, locale)}</h3>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden" style={{ boxShadow: "var(--card-shadow)" }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 860 }}>
            <thead>
              <tr>
                {[C_NAME, C_UNIT, C_2024, C_2025, C_DIFF, C_PCT].map((c, i) => (
                  <th key={i}
                    className={`px-3.5 py-3 text-[11px] font-bold uppercase tracking-wide align-middle ${i === 0 ? "text-left" : "text-center"}`}
                    style={{ color: "var(--accent)", background: "rgba(var(--accent-rgb),0.07)", borderBottom: "1px solid var(--border)", borderRight: i < 5 ? cellBorder : "none", minWidth: i === 0 ? 240 : i === 4 || i === 5 ? 120 : 90 }}>
                    {t(c, locale)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => {
                const up = r.pct ? parseFloat(r.pct.replace(",", ".")) >= 100 : true;
                return (
                  <motion.tr key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.08 + i * 0.06 }}
                    className="transition-colors duration-200 hover:bg-[rgba(56,189,248,0.09)]"
                    style={i === 0 ? { background: "rgba(var(--accent-rgb),0.10)" } : undefined}
                  >
                    <td className="py-3 align-middle leading-snug" style={{ paddingLeft: 14 + r.level * 22, paddingRight: 14, fontSize: 13, fontWeight: r.level === 0 ? 700 : 500, color: "var(--content)", borderBottom: cellBorder, borderRight: cellBorder }}>
                      {t(r.name, locale)}
                    </td>
                    <td className="px-3 py-3 text-center align-middle whitespace-nowrap" style={{ fontSize: 11, color: "var(--content-muted)", borderBottom: cellBorder, borderRight: cellBorder }}>{t(r.unit, locale)}</td>
                    <td className="px-3.5 py-3 text-right align-middle tabular-nums" style={{ fontSize: 13, fontWeight: r.level === 0 ? 700 : 500, color: "var(--content)", borderBottom: cellBorder, borderRight: cellBorder }}>{r.v2024}</td>
                    <td className="px-3.5 py-3 text-right align-middle tabular-nums" style={{ fontSize: 13, fontWeight: r.level === 0 ? 700 : 500, color: "var(--content)", borderBottom: cellBorder, borderRight: cellBorder }}>{r.v2025}</td>
                    <td className="px-3.5 py-3 text-right align-middle tabular-nums font-bold" style={{ fontSize: 13, color: changeColor(r.change), borderBottom: cellBorder, borderRight: cellBorder }}>{r.change}</td>
                    <td className="px-3 py-3 text-center align-middle" style={{ borderBottom: cellBorder }}>
                      {r.pct ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold tabular-nums" style={{
                          fontSize: 12,
                          background: up ? "rgba(16,185,129,0.15)" : "rgba(248,113,113,0.15)",
                          color: up ? "rgb(52,211,153)" : "rgb(248,113,113)",
                          border: `1px solid ${up ? "rgba(16,185,129,0.4)" : "rgba(248,113,113,0.4)"}`,
                        }}>
                          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {r.pct} %
                        </span>
                      ) : (
                        <span style={{ color: "var(--content-muted)" }}>—</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
