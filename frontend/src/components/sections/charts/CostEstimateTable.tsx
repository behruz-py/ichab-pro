"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { CostRow, Loc } from "@/types/internal";

const t = (o: Loc, l: string) => o[l] ?? o.uz;

const HEADING: Loc = { uz: "ICHAB xarajatlar smetasi", ru: "Смета расходов ICHAB", en: "ICHAB cost estimate" };
const H_NAME: Loc = { uz: "Xarajat moddalari nomi", ru: "Наименование статей расходов", en: "Cost item" };
const H_2025: Loc = { uz: "2025-yil", ru: "2025 год", en: "2025" };
const H_FCAST: Loc = { uz: "bashorat", ru: "прогноз", en: "forecast" };
const H_EXP: Loc = { uz: "kutilmoqda", ru: "ожидается", en: "expected" };
const H_SUM: Loc = { uz: "mln so'm", ru: "млн сум", en: "mln UZS" };
const H_SHARE: Loc = { uz: "Ulush, %", ru: "Доля, %", en: "Share, %" };
const H_2026: Loc = { uz: "2026-yil", ru: "2026 год", en: "2026" };
const H_PCT: Loc = { uz: "2025-yilga nisbatan %", ru: "к 2025 году %", en: "vs 2025 %" };

export function CostEstimateTable({ locale, data }: { locale: string; data: CostRow[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const cb = "1px solid var(--border-subtle)";
  const thBg = "rgba(var(--accent-rgb),0.07)";

  return (
    <section ref={ref}>
      <div className="mb-6">
        <h3 className="font-display font-bold text-content" style={{ fontSize: "clamp(20px,2.4vw,28px)" }}>{t(HEADING, locale)}</h3>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden" style={{ boxShadow: "var(--card-shadow)" }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center" style={{ minWidth: 920 }}>
            <thead style={{ color: "var(--accent)" }}>
              <tr>
                <th rowSpan={3} className="px-4 py-3 text-left align-middle text-[13.5px] font-bold uppercase tracking-wide" style={{ background: thBg, borderBottom: "1px solid var(--border)", borderRight: cb, minWidth: 240 }}>{t(H_NAME, locale)}</th>
                <th colSpan={4} className="px-4 py-2.5 text-[14px] font-bold uppercase tracking-wide" style={{ background: thBg, borderBottom: cb, borderRight: cb }}>{t(H_2025, locale)}</th>
                <th rowSpan={3} className="px-4 py-3 align-middle text-[13.5px] font-bold uppercase tracking-wide" style={{ background: thBg, borderBottom: "1px solid var(--border)", borderRight: cb, minWidth: 90 }}>{t(H_2026, locale)}</th>
                <th rowSpan={3} className="px-3 py-3 align-middle text-[13px] font-bold uppercase tracking-wide leading-tight" style={{ background: thBg, borderBottom: "1px solid var(--border)", minWidth: 110 }}>{t(H_PCT, locale)}</th>
              </tr>
              <tr>
                <th colSpan={2} className="px-4 py-2 text-[13.5px] font-bold" style={{ background: thBg, borderBottom: cb, borderRight: cb }}>{t(H_FCAST, locale)}</th>
                <th colSpan={2} className="px-4 py-2 text-[13.5px] font-bold" style={{ background: thBg, borderBottom: cb, borderRight: cb }}>{t(H_EXP, locale)}</th>
              </tr>
              <tr>
                <th className="px-3 py-2 text-[12.5px] font-semibold" style={{ background: thBg, borderBottom: "1px solid var(--border)", borderRight: cb, color: "var(--content-secondary)" }}>{t(H_SUM, locale)}</th>
                <th className="px-3 py-2 text-[12.5px] font-semibold" style={{ background: thBg, borderBottom: "1px solid var(--border)", borderRight: cb, color: "var(--content-secondary)" }}>{t(H_SHARE, locale)}</th>
                <th className="px-3 py-2 text-[12.5px] font-semibold" style={{ background: thBg, borderBottom: "1px solid var(--border)", borderRight: cb, color: "var(--content-secondary)" }}>{t(H_SUM, locale)}</th>
                <th className="px-3 py-2 text-[12.5px] font-semibold" style={{ background: thBg, borderBottom: "1px solid var(--border)", borderRight: cb, color: "var(--content-secondary)" }}>{t(H_SHARE, locale)}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => {
                const up = r.pct ? parseFloat(r.pct.replace(",", ".")) >= 100 : true;
                const fw = r.bold ? 700 : 500;
                return (
                  <motion.tr key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.06 + i * 0.05 }}
                    className="transition-colors duration-200 hover:bg-[rgba(56,189,248,0.09)]"
                    style={r.bold ? { background: "rgba(var(--accent-rgb),0.10)" } : undefined}
                  >
                    <td className="px-4 py-3 text-left align-middle leading-snug" style={{ fontSize: 14.5, fontWeight: fw, color: "var(--content)", borderBottom: cb, borderRight: cb }}>{t(r.name, locale)}</td>
                    <td className="px-3.5 py-3 text-right align-middle tabular-nums" style={{ fontSize: 14.5, fontWeight: fw, color: "var(--content)", borderBottom: cb, borderRight: cb }}>{r.bSum}</td>
                    <td className="px-3 py-3 align-middle tabular-nums" style={{ fontSize: 14, fontWeight: fw, color: "var(--content-secondary)", borderBottom: cb, borderRight: cb }}>{r.bShare ?? "—"}</td>
                    <td className="px-3.5 py-3 text-right align-middle tabular-nums" style={{ fontSize: 14.5, fontWeight: fw, color: "var(--content)", borderBottom: cb, borderRight: cb }}>{r.kSum}</td>
                    <td className="px-3 py-3 align-middle tabular-nums" style={{ fontSize: 14, fontWeight: fw, color: "var(--content-secondary)", borderBottom: cb, borderRight: cb }}>{r.kShare ?? "—"}</td>
                    <td className="px-3.5 py-3 text-right align-middle tabular-nums" style={{ fontSize: 14.5, fontWeight: fw, color: "var(--content)", borderBottom: cb, borderRight: cb }}>{r.y2026}</td>
                    <td className="px-3 py-3 align-middle" style={{ borderBottom: cb }}>
                      {r.pct ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold tabular-nums" style={{
                          fontSize: 13.5,
                          background: up ? "rgba(16,185,129,0.15)" : "rgba(248,113,113,0.15)",
                          color: up ? "rgb(52,211,153)" : "rgb(248,113,113)",
                          border: `1px solid ${up ? "rgba(16,185,129,0.4)" : "rgba(248,113,113,0.4)"}`,
                        }}>
                          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {r.pct} %
                        </span>
                      ) : <span style={{ color: "var(--content-muted)" }}>—</span>}
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
