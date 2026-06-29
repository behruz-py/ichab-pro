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
const PLOT_H = 360;
const COL_W = 78;
const BAR_W = 44;

const GREEN = { base: "46,184,92",  light: "130,228,156", dark: "20,112,58" };
const AMBER = { base: "245,182,16", light: "255,214,92",  dark: "194,132,8" };

const TITLE: Loc = { uz: "Yillik ishlab chiqarish hajmi", ru: "Годовой объём производства", en: "Annual production volume" };
const SUB: Loc = {
  uz: "Markaziy laboratoriya · mln so'm · 2026-yil — reja",
  ru: "Центральная лаборатория · млн сум · 2026 — прогноз",
  en: "Central laboratory · mln UZS · 2026 — forecast",
};
const LEG_PROD: Loc = { uz: "Yillik ishlab chiqarish", ru: "Годовое производство", en: "Annual production" };
const LEG_HELIO: Loc = { uz: "Geliokollektor", ru: "Гелиоколлектор", en: "Solar collector" };
const FORECAST: Loc = { uz: "reja", ru: "прогноз", en: "forecast" };

const fmt = (n: number) => n.toLocaleString("ru-RU");

function useCountUp(target: number, run: boolean, dur = 1600) {
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

/** A glossy 3D cylinder segment. */
function Segment({ color, h, isTop }: { color: typeof GREEN; h: number; isTop: boolean }) {
  const capH = Math.min(14, Math.max(8, h * 0.12));
  return (
    <div className="relative w-full" style={{ height: h }}>
      <div className="absolute inset-0" style={{
        background: `linear-gradient(to right, rgb(${color.light}) 0%, rgb(${color.base}) 26%, rgb(${color.base}) 56%, rgb(${color.dark}) 100%)`,
        borderTopLeftRadius: isTop ? `50% ${capH}px` : 0,
        borderTopRightRadius: isTop ? `50% ${capH}px` : 0,
        boxShadow: `0 0 20px rgba(${color.base},0.45), inset 0 0 14px rgba(255,255,255,0.14)`,
      }} />
      {isTop && (
        <div className="absolute left-0 right-0" style={{
          top: -capH / 2, height: capH, borderRadius: "50%",
          background: `radial-gradient(ellipse at 50% 32%, rgb(${color.light}) 0%, rgb(${color.base}) 100%)`,
          boxShadow: `0 -2px 10px rgba(${color.base},0.5)`,
        }} />
      )}
    </div>
  );
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
        {/* total value label above the bar */}
        <div className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none"
          style={{ bottom: totalH + 10 }}>
          <span className="font-display font-bold tabular-nums" style={{ fontSize: 13, color: "var(--content)" }}>
            {fmt(total)}
          </span>
        </div>

        {/* bar */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col justify-end transition-[filter] duration-300 group-hover:brightness-110"
          style={{ width: BAR_W, transformOrigin: "bottom" }}
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.9, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          {helioH > 0 && (
            <div className="relative">
              <Segment color={AMBER} h={helioH} isTop />
              {/* helio value inside the amber segment */}
              <div className="absolute inset-0 flex items-center justify-center gap-1 pointer-events-none">
                <Sun size={11} color="#fff" />
                <span className="font-bold tabular-nums" style={{ fontSize: 11, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
                  {fmt(helioV)}
                </span>
              </div>
            </div>
          )}
          <Segment color={GREEN} h={prodH} isTop={helioH === 0} />
        </motion.div>
      </div>

      {/* year label */}
      <div className="mt-2.5 text-center">
        <span className="font-semibold" style={{ fontSize: 12.5, color: "var(--content-secondary)" }}>{d.year}</span>
        {d.forecast && (
          <span className="block text-[9px] font-bold uppercase tracking-wide mt-0.5" style={{ color: "var(--accent)" }}>
            {tr(FORECAST, locale)}
          </span>
        )}
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
      {/* Heading */}
      <div className="mb-8">
        <h3 className="font-display font-bold text-content" style={{ fontSize: "clamp(20px,2.4vw,28px)" }}>{tr(TITLE, locale)}</h3>
        <p className="mt-1.5 text-sm" style={{ color: "var(--content-secondary)" }}>{tr(SUB, locale)}</p>
      </div>

      {/* Chart (scrolls horizontally on small screens) */}
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
            {/* gridlines */}
            {steps.map((v) => (
              <div key={v} className="absolute inset-x-0 h-px" style={{ bottom: (v / AXIS_MAX) * PLOT_H, background: "rgba(var(--accent-rgb),0.10)" }} />
            ))}
            {/* baseline */}
            <div className="absolute inset-x-0" style={{ bottom: 0, height: 2, background: "rgba(var(--accent-rgb),0.35)" }} />
            {/* columns */}
            <div className="relative flex items-end justify-around" style={{ height: PLOT_H }}>
              {DATA.map((d, i) => (
                <Column key={d.year} d={d} i={i} inView={inView} locale={locale} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-7 gap-y-2 mt-6 pl-14">
        <span className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--content-secondary)" }}>
          <span className="w-4 h-4 rounded" style={{ background: `linear-gradient(135deg, rgb(${GREEN.light}), rgb(${GREEN.dark}))`, boxShadow: `0 0 10px rgba(${GREEN.base},0.5)` }} />
          {tr(LEG_PROD, locale)}
        </span>
        <span className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--content-secondary)" }}>
          <span className="w-4 h-4 rounded" style={{ background: `linear-gradient(135deg, rgb(${AMBER.light}), rgb(${AMBER.dark}))`, boxShadow: `0 0 10px rgba(${AMBER.base},0.5)` }} />
          {tr(LEG_HELIO, locale)}
        </span>
      </div>
    </div>
  );
}
