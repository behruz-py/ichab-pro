"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type Loc = Record<string, string>;
const t = (o: Loc, l: string) => o[l] ?? o.uz;

const HEADING: Loc = {
  uz: "Mahalliylashtirilgan mahsulot ishlab chiqarishining o'sish dinamikasi",
  ru: "Динамика роста производства локализованной продукции",
  en: "Growth dynamics of localized product manufacturing",
};
const LEG_DONA: Loc = { uz: "Mahsulot turlari, dona", ru: "Виды продукции, шт.", en: "Product types, units" };
const LEG_VOL: Loc = { uz: "Ishlab chiqarish hajmi, mln so'm", ru: "Объём производства, млн сум", en: "Production volume, mln UZS" };

const NOTE1: Loc = {
  uz: "2020 yilgacha o'zlashtirilgan mahsulotlarning asosiy ulushi oddiy turdagi mahsulotlardan iborat edi. Ammo 2022 yilga kelib, ishlab chiqarish jarayonlari modernizatsiya qilingandan so'ng yuqori kuchlanishli mahsulotlar hamda o'lchov vositalari va asboblarini ishlab chiqarish o'zlashtirildi.",
  ru: "До 2020 года основную долю освоенной продукции составляли изделия простого типа. Однако к 2022 году, после модернизации производственных процессов, было освоено производство высоковольтной продукции, а также средств измерений и приборов.",
  en: "Until 2020, the bulk of mastered products were simple-type items. By 2022, after modernizing the production processes, high-voltage products and measuring instruments were mastered.",
};
const NOTE2: Loc = {
  uz: "So'nggi 4 yil davomida iqtisodiy jihatdan samarali, import o'rnini bosuvchi yuqori texnologiyali mahsulotlarni o'zlashtirish bo'yicha ishlar olib borilmoqda.",
  ru: "В последние 4 года ведётся работа по освоению экономически эффективной, импортозамещающей высокотехнологичной продукции.",
  en: "Over the past 4 years, work has been under way to master cost-effective, import-substituting high-tech products.",
};

interface Row { year: number; dona: number; vol: string; volNum: number; forecast?: boolean }
const DATA: Row[] = [
  { year: 2022, dona: 18, vol: "3 845.9", volNum: 3845.9 },
  { year: 2023, dona: 20, vol: "4 486.6", volNum: 4486.6 },
  { year: 2024, dona: 21, vol: "4 876.4", volNum: 4876.4 },
  { year: 2025, dona: 24, vol: "9 250.5", volNum: 9250.5 },
  { year: 2026, dona: 24, vol: "10 545.6", volNum: 10545.6, forecast: true },
];

const AXIS_MAX = 12000, STEP = 2000, DONA_VIS_MAX = 100;
const PLOT_H = 340, CHART_H = PLOT_H + 40, BAR_W = 34;

const DONA_GRAD = "linear-gradient(to top, rgba(5,150,105,0.65) 0%, rgba(16,185,129,0.9) 100%)";
const DONA_SOLID = "linear-gradient(to top,#059669,#10B981)";
const DONA_GLOW = "rgba(16,185,129,0.45)";
const VOL_GRAD = "linear-gradient(to top, rgba(16,185,129,0.45) 0%, rgba(110,231,183,0.92) 100%)";
const VOL_SOLID = "linear-gradient(to top,#10B981,#6EE7B7)";
const VOL_GLOW = "rgba(110,231,183,0.45)";

function useCountUp(target: number, run: boolean, dur = 1400) {
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

function Bar({ h, grad, glow, label, delay, inView }: { h: number; grad: string; glow: string; label: React.ReactNode; delay: number; inView: boolean }) {
  return (
    <div className="relative" style={{ width: BAR_W, height: CHART_H }}>
      <div className="absolute bottom-0 inset-x-0 rounded-t" style={{ height: PLOT_H, background: "rgba(var(--accent-rgb),0.05)" }} />
      <div className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none" style={{ bottom: h + 8 }}>
        <span className="font-display font-bold tabular-nums" style={{ fontSize: 12, color: "var(--content)" }}>{label}</span>
      </div>
      <motion.div className="absolute bottom-0 inset-x-0 rounded-t-md" style={{
        height: h, background: grad, transformOrigin: "bottom",
        border: "1px solid rgba(255,255,255,0.22)", borderBottom: "none",
        backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
        boxShadow: `0 0 16px ${glow}, inset 0 1.5px 0 rgba(255,255,255,0.45)`,
      }} initial={{ scaleY: 0 }} animate={inView ? { scaleY: 1 } : { scaleY: 0 }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }} />
    </div>
  );
}

function DonaCount({ to, inView }: { to: number; inView: boolean }) {
  return <>{useCountUp(to, inView)}</>;
}

export function LocalizationGrowthChart({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const steps = Array.from({ length: AXIS_MAX / STEP + 1 }, (_, k) => k * STEP);

  const note = (text: string) => (
    <div className="rounded-2xl p-5" style={{ background: "rgba(16,185,129,0.06)", border: "1.5px solid rgba(16,185,129,0.45)", boxShadow: "0 0 18px rgba(16,185,129,0.12)" }}>
      <p className="text-sm leading-relaxed" style={{ color: "var(--content-secondary)" }}>{text}</p>
    </div>
  );

  return (
    <section ref={ref}>
      <div className="mb-6">
        <h3 className="font-display font-bold text-content leading-snug" style={{ fontSize: "clamp(20px,2.4vw,28px)" }}>{t(HEADING, locale)}</h3>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Chart */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 sm:p-8" style={{ boxShadow: "var(--card-shadow)" }}>
          <div className="overflow-x-auto pb-2">
            <div className="flex" style={{ minWidth: 560 }}>
              <div className="relative flex-shrink-0" style={{ width: 50, height: CHART_H }}>
                {steps.map((v) => (
                  <span key={v} className="absolute right-2 -translate-y-1/2 tabular-nums" style={{ bottom: (v / AXIS_MAX) * PLOT_H, fontSize: 10.5, color: "var(--content-muted)" }}>
                    {v === 0 ? "0" : `${v / 1000}k`}
                  </span>
                ))}
              </div>
              <div className="relative flex-1">
                {steps.map((v) => (
                  <div key={v} className="absolute inset-x-0 h-px" style={{ bottom: (v / AXIS_MAX) * PLOT_H, background: "rgba(148,180,220,0.10)" }} />
                ))}
                <div className="absolute inset-x-0" style={{ bottom: 0, height: 2, background: "rgba(var(--accent-rgb),0.35)" }} />
                <div className="relative flex items-end justify-around" style={{ height: CHART_H }}>
                  {DATA.map((d, i) => (
                    <div key={d.year} className="flex flex-col items-center">
                      <div className="flex items-end gap-1.5">
                        <Bar h={(d.dona / DONA_VIS_MAX) * PLOT_H} grad={DONA_GRAD} glow={DONA_GLOW} delay={0.15 + i * 0.08} inView={inView} label={<DonaCount to={d.dona} inView={inView} />} />
                        <Bar h={(d.volNum / AXIS_MAX) * PLOT_H} grad={VOL_GRAD} glow={VOL_GLOW} delay={0.25 + i * 0.08} inView={inView} label={d.vol} />
                      </div>
                      <div className="mt-2.5 text-center">
                        <span className="font-semibold" style={{ fontSize: 12.5, color: "var(--content-secondary)" }}>{d.year}</span>
                        {d.forecast && <span className="block text-[9px] font-bold uppercase tracking-wide mt-0.5" style={{ color: "rgb(52,211,153)" }}>reja</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2 mt-5 pl-12">
            <span className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--content-secondary)" }}>
              <span className="w-4 h-4 rounded" style={{ background: DONA_SOLID, boxShadow: `0 0 10px ${DONA_GLOW}` }} />
              {t(LEG_DONA, locale)}
            </span>
            <span className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--content-secondary)" }}>
              <span className="w-4 h-4 rounded" style={{ background: VOL_SOLID, boxShadow: `0 0 10px ${VOL_GLOW}` }} />
              {t(LEG_VOL, locale)}
            </span>
          </div>
        </div>

        {/* Annotation notes */}
        <div className="space-y-5">
          {note(t(NOTE1, locale))}
          {note(t(NOTE2, locale))}
        </div>
      </div>
    </section>
  );
}
