"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type Loc = Record<string, string>;
const tr = (o: Loc, l: string) => o[l] ?? o.uz;
const fmt = (n: number) => n.toLocaleString("ru-RU");
const lighten = (rgb: string, f: number) => rgb.split(",").map((n) => Math.round(+n + (255 - +n) * f)).join(",");

const TITLE: Loc = { uz: "Statistika va yutuqlar", ru: "Статистика и достижения", en: "Statistics & Achievements" };
const SUB: Loc = {
  uz: "Korxonamizning o'sishi, ko'rsatkichlari va erishilgan natijalari",
  ru: "Рост, показатели и достигнутые результаты нашего предприятия",
  en: "Our company's growth, indicators and achieved results",
};

interface Kpi { value: number; suffix: string; rgb: string; label: Loc }
const KPIS: Kpi[] = [
  { value: 81000, suffix: "", rgb: "56,189,248", label: { uz: "2025-yil yalpi mahsulot, mln so'm", ru: "Валовая продукция 2025, млн сум", en: "2025 gross output, mln UZS" } },
  { value: 151, suffix: "%", rgb: "16,185,129", label: { uz: "2024 → 2025 o'sish", ru: "Рост 2024 → 2025", en: "2024 → 2025 growth" } },
  { value: 18, suffix: "", rgb: "139,92,246", label: { uz: "Lokalizatsiyalangan mahsulot turi", ru: "Видов локализованной продукции", en: "Localized product types" } },
  { value: 82000, suffix: "", rgb: "245,158,11", label: { uz: "2026 ishlab chiqarish rejasi, mln so'm", ru: "План производства 2026, млн сум", en: "2026 production plan, mln UZS" } },
];

function useCountUp(target: number, run: boolean, dur = 1700) {
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

function KpiCard({ k, i, inView, locale }: { k: Kpi; i: number; inView: boolean; locale: string }) {
  const v = useCountUp(k.value, inView);
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
      className="glass-card rounded-2xl p-5 text-center" style={{ border: `1px solid rgba(${k.rgb},0.28)`, boxShadow: `var(--card-shadow), 0 0 26px rgba(${k.rgb},0.10)` }}>
      <div className="font-display font-extrabold tabular-nums leading-none"
        style={{ fontSize: "clamp(26px,3.4vw,40px)", background: `linear-gradient(135deg, rgb(${lighten(k.rgb, 0.3)}), rgb(${k.rgb}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
        {fmt(v)}{k.suffix}
      </div>
      <div className="mt-2.5 text-xs leading-snug" style={{ color: "var(--content-secondary)" }}>{tr(k.label, locale)}</div>
    </motion.div>
  );
}

export function StatsHero({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className="text-center">
      <motion.h1 initial={{ opacity: 0, y: 22 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-4xl md:text-5xl lg:text-6xl font-bold title-sheen inline-block pb-1">{tr(TITLE, locale)}</motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.15 }}
        className="text-content-secondary text-lg max-w-2xl mx-auto mt-4">{tr(SUB, locale)}</motion.p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
        {KPIS.map((k, i) => <KpiCard key={i} k={k} i={i} inView={inView} locale={locale} />)}
      </div>
    </div>
  );
}
