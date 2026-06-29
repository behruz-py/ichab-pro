"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

type Loc = Record<string, string>;
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

interface Row { name: string; bSum: string; bShare?: string; kSum: string; kShare?: string; y2026: string; pct?: string; bold?: boolean }

const ROWS: Row[] = [
  { name: "Material xarajatlari", bSum: "50 314", bShare: "55", kSum: "50 314", kShare: "55", y2026: "44 160", pct: "87,8" },
  { name: "Mehnatga haq to'lash xarajatlari", bSum: "19 949", bShare: "22", kSum: "19 949", kShare: "22", y2026: "20 000", pct: "100,3" },
  { name: "Yagona ijtimoiy to'lov", bSum: "2 394", bShare: "3", kSum: "2 394", kShare: "3", y2026: "2 400", pct: "100,3" },
  { name: "Amortizatsiya ajratmalari", bSum: "1 566", bShare: "3", kSum: "1 566", kShare: "3", y2026: "1 780", pct: "113,7" },
  { name: "Ishlab chiqarish maqsadidagi boshqa xarajatlar", bSum: "7 252", bShare: "8", kSum: "7 252", kShare: "8", y2026: "5 601", pct: "77,2" },
  { name: "Jami ishlab chiqarish tannarxi", bSum: "81 475", bShare: "90", kSum: "81 475", kShare: "90", y2026: "71 941", pct: "88,3", bold: true },
  { name: "Ma'muriy xarajatlar", bSum: "6 155", bShare: "7", kSum: "6 155", kShare: "7", y2026: "6 100", pct: "99,1" },
  { name: "Boshqa operatsion xarajatlar", bSum: "2 570", bShare: "3", kSum: "2 570", kShare: "3", y2026: "1 959", pct: "76,2" },
  { name: "Jami davr xarajatlari", bSum: "8 725", bShare: "10", kSum: "8 725", kShare: "10", y2026: "8 059", pct: "92,4", bold: true },
  { name: "JAMI", bSum: "90 200", kSum: "90 200", y2026: "82 000", pct: "90,9", bold: true },
];

export function CostEstimateTable({ locale }: { locale: string }) {
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
                <th rowSpan={3} className="px-4 py-3 text-left align-middle text-[12px] font-bold uppercase tracking-wide" style={{ background: thBg, borderBottom: "1px solid var(--border)", borderRight: cb, minWidth: 240 }}>{t(H_NAME, locale)}</th>
                <th colSpan={4} className="px-4 py-2.5 text-[12.5px] font-bold uppercase tracking-wide" style={{ background: thBg, borderBottom: cb, borderRight: cb }}>{t(H_2025, locale)}</th>
                <th rowSpan={3} className="px-4 py-3 align-middle text-[12px] font-bold uppercase tracking-wide" style={{ background: thBg, borderBottom: "1px solid var(--border)", borderRight: cb, minWidth: 90 }}>{t(H_2026, locale)}</th>
                <th rowSpan={3} className="px-3 py-3 align-middle text-[11px] font-bold uppercase tracking-wide leading-tight" style={{ background: thBg, borderBottom: "1px solid var(--border)", minWidth: 110 }}>{t(H_PCT, locale)}</th>
              </tr>
              <tr>
                <th colSpan={2} className="px-4 py-2 text-[12px] font-bold" style={{ background: thBg, borderBottom: cb, borderRight: cb }}>{t(H_FCAST, locale)}</th>
                <th colSpan={2} className="px-4 py-2 text-[12px] font-bold" style={{ background: thBg, borderBottom: cb, borderRight: cb }}>{t(H_EXP, locale)}</th>
              </tr>
              <tr>
                <th className="px-3 py-2 text-[10.5px] font-semibold" style={{ background: thBg, borderBottom: "1px solid var(--border)", borderRight: cb, color: "var(--content-secondary)" }}>{t(H_SUM, locale)}</th>
                <th className="px-3 py-2 text-[10.5px] font-semibold" style={{ background: thBg, borderBottom: "1px solid var(--border)", borderRight: cb, color: "var(--content-secondary)" }}>{t(H_SHARE, locale)}</th>
                <th className="px-3 py-2 text-[10.5px] font-semibold" style={{ background: thBg, borderBottom: "1px solid var(--border)", borderRight: cb, color: "var(--content-secondary)" }}>{t(H_SUM, locale)}</th>
                <th className="px-3 py-2 text-[10.5px] font-semibold" style={{ background: thBg, borderBottom: "1px solid var(--border)", borderRight: cb, color: "var(--content-secondary)" }}>{t(H_SHARE, locale)}</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => {
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
                    <td className="px-4 py-3 text-left align-middle leading-snug" style={{ fontSize: 13, fontWeight: fw, color: "var(--content)", borderBottom: cb, borderRight: cb }}>{r.name}</td>
                    <td className="px-3.5 py-3 text-right align-middle tabular-nums" style={{ fontSize: 13, fontWeight: fw, color: "var(--content)", borderBottom: cb, borderRight: cb }}>{r.bSum}</td>
                    <td className="px-3 py-3 align-middle tabular-nums" style={{ fontSize: 12.5, fontWeight: fw, color: "var(--content-secondary)", borderBottom: cb, borderRight: cb }}>{r.bShare ?? "—"}</td>
                    <td className="px-3.5 py-3 text-right align-middle tabular-nums" style={{ fontSize: 13, fontWeight: fw, color: "var(--content)", borderBottom: cb, borderRight: cb }}>{r.kSum}</td>
                    <td className="px-3 py-3 align-middle tabular-nums" style={{ fontSize: 12.5, fontWeight: fw, color: "var(--content-secondary)", borderBottom: cb, borderRight: cb }}>{r.kShare ?? "—"}</td>
                    <td className="px-3.5 py-3 text-right align-middle tabular-nums" style={{ fontSize: 13, fontWeight: fw, color: "var(--content)", borderBottom: cb, borderRight: cb }}>{r.y2026}</td>
                    <td className="px-3 py-3 align-middle" style={{ borderBottom: cb }}>
                      {r.pct ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold tabular-nums" style={{
                          fontSize: 12,
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
