"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Sun } from "lucide-react";

type Loc = Record<string, string>;
const tr = (o: Loc, l: string) => o[l] ?? o.uz;

interface Row { year: number; prod: number; helio?: number; forecast?: boolean }

const DATA: Row[] = [
  { year: 2016, prod: 6404 },
  { year: 2017, prod: 8022 },
  { year: 2018, prod: 12845 },
  { year: 2019, prod: 21827 },
  { year: 2020, prod: 38275 },
  { year: 2021, prod: 50526 },
  { year: 2022, prod: 50332 },
  { year: 2023, prod: 51260, helio: 20800 },
  { year: 2024, prod: 53300 },
  { year: 2025, prod: 81000 },
  { year: 2026, prod: 82000, forecast: true },
];

const AXIS_MAX = 90000;
const STEP = 10000;
const PLOT_H = 350;
const COL_W = 74;
const BAR_W = 40;

const PROD_GRAD  = "linear-gradient(to top, rgba(59,130,246,0.92) 0%, rgba(34,211,238,0.96) 58%, rgba(52,211,153,1) 100%)";
const PROD_GLOW  = "rgba(34,211,238,0.45)";
const HELIO_GRAD = "linear-gradient(to top, rgba(245,158,11,0.95) 0%, rgba(250,204,21,1) 100%)";
const HELIO_GLOW = "rgba(245,179,11,0.5)";

const fmt = (n: number) => n.toLocaleString("ru-RU");

const TITLE: Loc = { uz: "Yillik ishlab chiqarish hajmi", ru: "Годовой объём производства", en: "Annual production volume" };
const SUB: Loc = {
  uz: "Markaziy laboratoriya · mln so'm · 2026-yil — reja",
  ru: "Центральная лаборатория · млн сум · 2026 — прогноз",
  en: "Central laboratory · mln UZS · 2026 — forecast",
};
const LEG_PROD: Loc = { uz: "Yillik ishlab chiqarish", ru: "Годовое производство", en: "Annual production" };
const LEG_HELIO: Loc = { uz: "Geliokollektor (2023)", ru: "Гелиоколлектор (2023)", en: "Solar collector (2023)" };
const FORECAST: Loc = { uz: "reja", ru: "прогноз", en: "forecast" };

function useCountUp(target: number, run: boolean, dur = 1500) {
  const [v, setV] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!run || started.current) return;
    started.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(target); return; }
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, dur]);
  return v;
}

function Column({ d, i, inView, locale }: { d: Row; i: number; inView: boolean; locale: string }) {
  const prodH  = (d.prod / AXIS_MAX) * PLOT_H;
  const helioH = d.helio ? (d.helio / AXIS_MAX) * PLOT_H : 0;
  const totalH = prodH + helioH;
  const total  = useCountUp(d.prod + (d.helio ?? 0), inView);
  const helioV = useCountUp(d.helio ?? 0, inView);

  return (
    <div className="group flex flex-col items-center" style={{ width: COL_W }}>
      <div className="relative w-full" style={{ height: PLOT_H }}>
        {/* slot track */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-lg" style={{ width: BAR_W, height: PLOT_H, background: "rgba(var(--accent-rgb),0.05)" }} />

        {/* value label */}
        <div className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none" style={{ bottom: totalH + 10 }}>
          <span className="font-display font-bold tabular-nums" style={{ fontSize: 13, color: "var(--content)" }}>{fmt(total)}</span>
        </div>

        {/* bar */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col justify-end transition-[filter] duration-300 group-hover:brightness-110"
          style={{ width: BAR_W, transformOrigin: "bottom" }}
          initial={{ scaleY: 0 }} animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.85, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* helio (amber) segment */}
          {helioH > 0 && (
            <div className="relative w-full rounded-t-lg" style={{ height: helioH, background: HELIO_GRAD, boxShadow: `0 0 18px ${HELIO_GLOW}, inset 0 1.5px 0 rgba(255,255,255,0.5)` }}>
              <div className="absolute inset-0 flex items-center justify-center gap-0.5">
                <Sun size={10} color="#fff" />
                <span className="font-bold tabular-nums" style={{ fontSize: 10, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.45)" }}>{fmt(helioV)}</span>
              </div>
            </div>
          )}
          {/* production segment */}
          <div className="w-full" style={{
            height: prodH,
            background: d.forecast ? "rgba(52,211,153,0.18)" : PROD_GRAD,
            border: d.forecast ? "2px dashed rgba(52,211,153,0.8)" : "none",
            borderRadius: helioH > 0 ? "0 0 4px 4px" : "8px 8px 4px 4px",
            boxShadow: d.forecast ? `0 0 18px ${PROD_GLOW}` : `0 0 18px ${PROD_GLOW}, inset 0 1.5px 0 rgba(255,255,255,0.45)`,
          }} />
        </motion.div>
      </div>

      {/* year */}
      <div className="mt-2.5 text-center">
        <span className="font-semibold" style={{ fontSize: 12.5, color: "var(--content-secondary)" }}>{d.year}</span>
        {d.forecast && <span className="block text-[9px] font-bold uppercase tracking-wide mt-0.5" style={{ color: "var(--accent)" }}>{tr(FORECAST, locale)}</span>}
      </div>
    </div>
  );
}

export function ProductionVolumeChart({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const steps = Array.from({ length: AXIS_MAX / STEP + 1 }, (_, k) => k * STEP);

  return (
    <div ref={ref} className="glass-card rounded-3xl p-6 sm:p-8" style={{ boxShadow: "var(--card-shadow)" }}>
      <div className="mb-8">
        <h3 className="font-display font-bold text-content" style={{ fontSize: "clamp(20px,2.4vw,28px)" }}>{tr(TITLE, locale)}</h3>
        <p className="mt-1.5 text-sm" style={{ color: "var(--content-secondary)" }}>{tr(SUB, locale)}</p>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex" style={{ minWidth: 900 }}>
          {/* Y axis */}
          <div className="relative flex-shrink-0" style={{ width: 56, height: PLOT_H }}>
            {steps.map((v) => (
              <span key={v} className="absolute right-2 -translate-y-1/2 tabular-nums" style={{ bottom: (v / AXIS_MAX) * PLOT_H, fontSize: 10.5, color: "var(--content-muted)" }}>
                {v === 0 ? "0" : `${v / 1000}k`}
              </span>
            ))}
          </div>

          {/* Plot */}
          <div className="relative flex-1">
            {steps.map((v) => (
              <div key={v} className="absolute inset-x-0 h-px" style={{ bottom: (v / AXIS_MAX) * PLOT_H, background: "rgba(148,180,220,0.10)" }} />
            ))}
            <div className="absolute inset-x-0" style={{ bottom: 0, height: 2, background: "rgba(var(--accent-rgb),0.35)" }} />
            <div className="relative flex items-end justify-around" style={{ height: PLOT_H }}>
              {DATA.map((d, i) => <Column key={d.year} d={d} i={i} inView={inView} locale={locale} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-7 gap-y-2 mt-6 pl-14">
        <span className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--content-secondary)" }}>
          <span className="w-4 h-4 rounded" style={{ background: PROD_GRAD, boxShadow: `0 0 10px ${PROD_GLOW}` }} />
          {tr(LEG_PROD, locale)}
        </span>
        <span className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--content-secondary)" }}>
          <span className="w-4 h-4 rounded" style={{ background: HELIO_GRAD, boxShadow: `0 0 10px ${HELIO_GLOW}` }} />
          {tr(LEG_HELIO, locale)}
        </span>
      </div>
    </div>
  );
}
