"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { IndicatorRow, Loc } from "@/types/internal";

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

const changeColor = (c: string) => (c.startsWith("-") ? "rgb(248,113,113)" : c === "0" ? "var(--content-muted)" : "rgb(52,211,153)");

export function MainIndicatorsTable({ locale, data }: { locale: string; data: IndicatorRow[] }) {
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
                    className={`px-3.5 py-3 text-[13px] font-bold uppercase tracking-wide align-middle ${i === 0 ? "text-left" : "text-center"}`}
                    style={{ color: "var(--accent)", background: "rgba(var(--accent-rgb),0.07)", borderBottom: "1px solid var(--border)", borderRight: i < 5 ? cellBorder : "none", minWidth: i === 0 ? 240 : i === 4 || i === 5 ? 120 : 90 }}>
                    {t(c, locale)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => {
                const up = r.pct ? parseFloat(r.pct.replace(",", ".")) >= 100 : true;
                return (
                  <motion.tr key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.08 + i * 0.06 }}
                    className="transition-colors duration-200 hover:bg-[rgba(56,189,248,0.09)]"
                    style={i === 0 ? { background: "rgba(var(--accent-rgb),0.10)" } : undefined}
                  >
                    <td className="py-3 align-middle leading-snug" style={{ paddingLeft: 14 + r.level * 22, paddingRight: 14, fontSize: 14.5, fontWeight: r.level === 0 ? 700 : 500, color: "var(--content)", borderBottom: cellBorder, borderRight: cellBorder }}>
                      {t(r.name, locale)}
                    </td>
                    <td className="px-3 py-3 text-center align-middle whitespace-nowrap" style={{ fontSize: 13, color: "var(--content-muted)", borderBottom: cellBorder, borderRight: cellBorder }}>{t(r.unit, locale)}</td>
                    <td className="px-3.5 py-3 text-right align-middle tabular-nums" style={{ fontSize: 14.5, fontWeight: r.level === 0 ? 700 : 500, color: "var(--content)", borderBottom: cellBorder, borderRight: cellBorder }}>{r.v2024}</td>
                    <td className="px-3.5 py-3 text-right align-middle tabular-nums" style={{ fontSize: 14.5, fontWeight: r.level === 0 ? 700 : 500, color: "var(--content)", borderBottom: cellBorder, borderRight: cellBorder }}>{r.v2025}</td>
                    <td className="px-3.5 py-3 text-right align-middle tabular-nums font-bold" style={{ fontSize: 14.5, color: changeColor(r.change), borderBottom: cellBorder, borderRight: cellBorder }}>{r.change}</td>
                    <td className="px-3 py-3 text-center align-middle" style={{ borderBottom: cellBorder }}>
                      {r.pct ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold tabular-nums" style={{
                          fontSize: 13.5,
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
