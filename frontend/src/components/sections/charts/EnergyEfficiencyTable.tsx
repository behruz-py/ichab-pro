"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp } from "lucide-react";

type Loc = Record<string, string>;
const t = (o: Loc, l: string) => o[l] ?? o.uz;

const HEADING: Loc = {
  uz: "2026-yil uchun ishlab chiqarish tannarxi va energiya sig'imini kamaytirish, energiya samaradorligini oshirish bo'yicha chora-tadbirlar",
  ru: "Меры по снижению себестоимости и энергоёмкости производства, повышению энергоэффективности на 2026 год",
  en: "Measures to cut production cost and energy intensity and raise energy efficiency for 2026",
};
const GROUP: Loc = { uz: "2025–2026 yillar bo'yicha tejalish", ru: "Экономия за 2025–2026 годы", en: "Savings for 2025–2026" };
const C_NO: Loc = { uz: "T/r", ru: "№", en: "No." };
const C_NAME: Loc = { uz: "Chora-tadbir nomi", ru: "Наименование меры", en: "Measure" };
const C_2025: Loc = { uz: "2025-yil (mln so'm)", ru: "2025 год (млн сум)", en: "2025 (mln UZS)" };
const C_2026: Loc = { uz: "2026-yil (mln so'm)", ru: "2026 год (млн сум)", en: "2026 (mln UZS)" };
const C_PCT: Loc = { uz: "2026 / 2025 (%)", ru: "2026 / 2025 (%)", en: "2026 / 2025 (%)" };
const C_TOTAL: Loc = { uz: "Jami", ru: "Итого", en: "Total" };

interface Row { n?: string; name: string; v2025: string; v2026: string; pct?: string; total?: boolean }

const ROWS: Row[] = [
  { name: C_TOTAL.uz, v2025: "5 693,9", v2026: "7 800,2", pct: "136 %", total: true },
  { n: "1", name: "Elektr energiyasi iste'molini qisqartirish", v2025: "12,8", v2026: "16,3", pct: "127,3 %" },
  { n: "2", name: "Xomashyo, materiallar va butlovchi qismlarni xarid qilish jarayonlarini optimallashtirish", v2025: "4 807,4", v2026: "811,4" },
  { n: "3", name: "Ishlab chiqarishdagi bilvosita xarajatlarni kamaytirish bo'yicha chora-tadbirlar", v2025: "873,7", v2026: "6 988,8" },
];

export function EnergyEfficiencyTable({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref}>
      <div className="mb-6">
        <h3 className="font-display font-bold text-content leading-snug" style={{ fontSize: "clamp(19px,2.3vw,26px)" }}>{t(HEADING, locale)}</h3>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden" style={{ boxShadow: "var(--card-shadow)" }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 720 }}>
            <thead>
              <tr>
                <th rowSpan={2} className="px-4 py-3 text-center align-middle text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--accent)", borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border-subtle)" }}>{t(C_NO, locale)}</th>
                <th rowSpan={2} className="px-4 py-3 text-left align-middle text-[12px] font-bold uppercase tracking-wide" style={{ color: "var(--accent)", borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border-subtle)" }}>{t(C_NAME, locale)}</th>
                <th colSpan={3} className="px-4 py-3 text-center text-[12.5px] font-bold uppercase tracking-wide" style={{ color: "var(--accent)", background: "rgba(var(--accent-rgb),0.08)", borderBottom: "1px solid var(--border-subtle)" }}>{t(GROUP, locale)}</th>
              </tr>
              <tr>
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold" style={{ color: "var(--content-secondary)", borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border-subtle)" }}>{t(C_2025, locale)}</th>
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold" style={{ color: "var(--content-secondary)", borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border-subtle)" }}>{t(C_2026, locale)}</th>
                <th className="px-4 py-2.5 text-center text-[11px] font-semibold" style={{ color: "var(--content-secondary)", borderBottom: "1px solid var(--border)" }}>{t(C_PCT, locale)}</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
                  className="transition-colors duration-200 hover:bg-[rgba(56,189,248,0.09)]"
                  style={r.total ? { background: "rgba(var(--accent-rgb),0.10)" } : undefined}
                >
                  <td className="px-4 py-3.5 text-center align-middle font-mono font-bold" style={{ fontSize: 13, color: r.total ? "var(--accent)" : "var(--content-secondary)", borderBottom: "1px solid var(--border-subtle)", borderRight: "1px solid var(--border-subtle)" }}>
                    {r.n ?? "—"}
                  </td>
                  <td className="px-4 py-3.5 align-middle leading-snug" style={{ fontSize: 13.5, fontWeight: r.total ? 700 : 500, color: "var(--content)", borderBottom: "1px solid var(--border-subtle)", borderRight: "1px solid var(--border-subtle)" }}>
                    {r.total ? t(C_TOTAL, locale) : r.name}
                  </td>
                  <td className="px-4 py-3.5 text-right align-middle tabular-nums" style={{ fontSize: 13.5, fontWeight: r.total ? 700 : 500, color: "var(--content)", borderBottom: "1px solid var(--border-subtle)", borderRight: "1px solid var(--border-subtle)" }}>
                    {r.v2025}
                  </td>
                  <td className="px-4 py-3.5 text-right align-middle tabular-nums" style={{ fontSize: 13.5, fontWeight: r.total ? 700 : 500, color: "var(--content)", borderBottom: "1px solid var(--border-subtle)", borderRight: "1px solid var(--border-subtle)" }}>
                    {r.v2026}
                  </td>
                  <td className="px-4 py-3.5 text-center align-middle" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    {r.pct ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold tabular-nums" style={{ fontSize: 12, background: "rgba(16,185,129,0.15)", color: "rgb(52,211,153)", border: "1px solid rgba(16,185,129,0.4)" }}>
                        <TrendingUp size={12} /> {r.pct}
                      </span>
                    ) : (
                      <span style={{ color: "var(--content-muted)" }}>—</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
