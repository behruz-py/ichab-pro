"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Sun, Target } from "lucide-react";

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
const CHART_H = PLOT_H + 36;   // headroom so the tallest bars' value labels aren't clipped
const COL_W = 74;
const BAR_W = 42;

// Glass (translucent) fills for the bars + solid versions for the legend swatches
const PROD_GLASS    = "linear-gradient(to top, rgba(59,130,246,0.34) 0%, rgba(34,211,238,0.46) 58%, rgba(52,211,153,0.60) 100%)";
const PROD_SOLID    = "linear-gradient(to top, #3B82F6 0%, #22D3EE 58%, #34D399 100%)";
const PROD_GLOW     = "rgba(34,211,238,0.45)";
const HELIO_GLASS   = "linear-gradient(to top, rgba(245,158,11,0.55) 0%, rgba(250,204,21,0.78) 100%)";
const HELIO_SOLID   = "linear-gradient(to top, #F59E0B 0%, #FACC15 100%)";
const HELIO_GLOW    = "rgba(245,179,11,0.5)";
const FORECAST_GLASS = "linear-gradient(to top, rgba(52,211,153,0.18) 0%, rgba(52,211,153,0.42) 100%)";

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
  const prodH   = (d.prod / AXIS_MAX) * PLOT_H;
  const helioH  = d.helio ? (d.helio / AXIS_MAX) * PLOT_H : 0;
  const totalH  = prodH + helioH;
  const prodV   = useCountUp(d.prod, inView);
  const helioV  = useCountUp(d.helio ?? 0, inView);
  const stacked = helioH > 0;

  return (
    <div className="group flex flex-col items-center" style={{ width: COL_W }}>
      <div className="relative w-full" style={{ height: CHART_H }}>
        {/* empty glass slot */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-lg" style={{ width: BAR_W, height: PLOT_H, background: "rgba(var(--accent-rgb),0.05)", border: "1px solid rgba(var(--accent-rgb),0.07)" }} />

        {/* helio value (above the amber top) */}
        {stacked && (
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 whitespace-nowrap pointer-events-none" style={{ bottom: totalH + 8 }}>
            <Sun size={11} style={{ color: "#F5B30B" }} />
            <span className="font-display font-bold tabular-nums" style={{ fontSize: 12.5, color: "#F5B30B" }}>{fmt(helioV)}</span>
          </div>
        )}

        {/* production value */}
        <div className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none flex items-center gap-1" style={{ bottom: stacked ? prodH - 22 : prodH + 8 }}>
          {d.forecast && <Target size={12} style={{ color: "var(--accent)" }} />}
          <span className="font-display font-bold tabular-nums"
            style={{ fontSize: 13, color: d.forecast ? "var(--accent)" : stacked ? "#fff" : "var(--content)", textShadow: stacked ? "0 1px 3px rgba(0,0,0,0.45)" : "none" }}>
            {fmt(prodV)}
          </span>
        </div>

        {/* bar */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col justify-end transition-[filter] duration-300 group-hover:brightness-110"
          style={{ width: BAR_W, transformOrigin: "bottom" }}
          initial={{ scaleY: 0 }} animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.85, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          {stacked && (
            <div className="w-full rounded-t-lg" style={{
              height: helioH, background: HELIO_GLASS,
              border: "1px solid rgba(255,255,255,0.28)", borderBottom: "none",
              backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)",
              boxShadow: `0 0 20px ${HELIO_GLOW}, inset 0 1.5px 0 rgba(255,255,255,0.6)`,
            }} />
          )}
          <div className="w-full" style={{
            height: prodH,
            background: d.forecast ? FORECAST_GLASS : PROD_GLASS,
            border: d.forecast ? "2px dashed rgba(52,211,153,0.85)" : "1px solid rgba(255,255,255,0.24)",
            borderBottom: "none",
            borderRadius: stacked ? "0 0 6px 6px" : "8px 8px 6px 6px",
            backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)",
            boxShadow: d.forecast
              ? `0 0 26px rgba(52,211,153,0.55), inset 0 1.5px 0 rgba(255,255,255,0.4), inset 0 0 22px rgba(52,211,153,0.18)`
              : `0 0 22px ${PROD_GLOW}, inset 0 1.5px 0 rgba(255,255,255,0.5)`,
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
          <div className="relative flex-shrink-0" style={{ width: 56, height: CHART_H }}>
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
            <div className="relative flex items-end justify-around" style={{ height: CHART_H }}>
              {DATA.map((d, i) => <Column key={d.year} d={d} i={i} inView={inView} locale={locale} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-7 gap-y-2 mt-6 pl-14">
        <span className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--content-secondary)" }}>
          <span className="w-4 h-4 rounded" style={{ background: PROD_SOLID, boxShadow: `0 0 10px ${PROD_GLOW}` }} />
          {tr(LEG_PROD, locale)}
        </span>
        <span className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--content-secondary)" }}>
          <span className="w-4 h-4 rounded" style={{ background: HELIO_SOLID, boxShadow: `0 0 10px ${HELIO_GLOW}` }} />
          {tr(LEG_HELIO, locale)}
        </span>
      </div>
    </div>
  );
}
