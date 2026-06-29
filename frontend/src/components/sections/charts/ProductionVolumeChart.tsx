"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

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

// SVG canvas (fixed px → crisp text; scrolls on small screens)
const W = 940, H = 440;
const PADL = 54, PADR = 30, PADT = 48, PADB = 40;
const PW = W - PADL - PADR;
const PH = H - PADT - PADB;

const fmt = (n: number) => n.toLocaleString("ru-RU");
const px = (i: number) => PADL + (i / (DATA.length - 1)) * PW;
const py = (v: number) => PADT + (1 - v / AXIS_MAX) * PH;

function smooth(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x},${pts[0].y}`;
  const t = 0.16;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? pts[i + 1];
    d += ` C ${p1.x + (p2.x - p0.x) * t},${p1.y + (p2.y - p0.y) * t} ${p2.x - (p3.x - p1.x) * t},${p2.y - (p3.y - p1.y) * t} ${p2.x},${p2.y}`;
  }
  return d;
}

const TITLE: Loc = { uz: "Yillik ishlab chiqarish hajmi", ru: "Годовой объём производства", en: "Annual production volume" };
const SUB: Loc = {
  uz: "Markaziy laboratoriya · mln so'm · 2026-yil — reja",
  ru: "Центральная лаборатория · млн сум · 2026 — прогноз",
  en: "Central laboratory · mln UZS · 2026 — forecast",
};
const LEG_PROD: Loc = { uz: "Yillik ishlab chiqarish", ru: "Годовое производство", en: "Annual production" };
const LEG_HELIO: Loc = { uz: "Geliokollektor (2023)", ru: "Гелиоколлектор (2023)", en: "Solar collector (2023)" };
const FORECAST: Loc = { uz: "reja", ru: "прогноз", en: "forecast" };

export function ProductionVolumeChart({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const pts = DATA.map((d, i) => ({ x: px(i), y: py(d.prod) }));
  const line = smooth(pts);
  const area = `${line} L ${pts[pts.length - 1].x},${PADT + PH} L ${pts[0].x},${PADT + PH} Z`;
  const steps = Array.from({ length: AXIS_MAX / STEP + 1 }, (_, k) => k * STEP);
  const helioIdx = DATA.findIndex((d) => d.helio);

  return (
    <div ref={ref} className="glass-card rounded-3xl p-6 sm:p-8" style={{ boxShadow: "var(--card-shadow)" }}>
      <div className="mb-6">
        <h3 className="font-display font-bold text-content" style={{ fontSize: "clamp(20px,2.4vw,28px)" }}>{tr(TITLE, locale)}</h3>
        <p className="mt-1.5 text-sm" style={{ color: "var(--content-secondary)" }}>{tr(SUB, locale)}</p>
      </div>

      <div className="overflow-x-auto pb-2">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ minWidth: W, display: "block" }}>
          <defs>
            <linearGradient id="pv-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            <linearGradient id="pv-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.42" />
              <stop offset="55%" stopColor="#22D3EE" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* grid + y labels */}
          {steps.map((v) => {
            const y = py(v);
            return (
              <g key={v}>
                <line x1={PADL} y1={y} x2={W - PADR} y2={y} stroke="rgba(148,180,220,0.12)" strokeWidth="1" />
                <text x={PADL - 10} y={y + 3.5} textAnchor="end" fontSize="10.5" fill="var(--content-muted)">{v === 0 ? "0" : `${v / 1000}k`}</text>
              </g>
            );
          })}

          {/* area */}
          <motion.path d={area} fill="url(#pv-area)"
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.9, delay: 0.5 }} />

          {/* glowing line */}
          <motion.path d={line} fill="none" stroke="url(#pv-line)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.75))" }}
            initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.7, ease: "easeInOut" }} />

          {/* 2023 Geliokollektor highlight: amber stem + callout */}
          {helioIdx >= 0 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 1.7 }}>
              <line x1={px(helioIdx)} y1={py(DATA[helioIdx].prod)} x2={px(helioIdx)} y2={py(DATA[helioIdx].prod + DATA[helioIdx].helio!)}
                stroke="#F5B30B" strokeWidth="3" strokeDasharray="2 4" style={{ filter: "drop-shadow(0 0 5px rgba(245,179,11,0.8))" }} />
              <circle cx={px(helioIdx)} cy={py(DATA[helioIdx].prod + DATA[helioIdx].helio!)} r="5" fill="#F5B30B" style={{ filter: "drop-shadow(0 0 6px rgba(245,179,11,0.9))" }} />
              <g transform={`translate(${px(helioIdx) - 52}, ${py(DATA[helioIdx].prod + DATA[helioIdx].helio!) - 34})`}>
                <rect width="104" height="24" rx="12" fill="rgba(245,179,11,0.16)" stroke="rgba(245,179,11,0.6)" />
                <text x="52" y="16" textAnchor="middle" fontSize="12" fontWeight="700" fill="#F5B30B">☀ +{fmt(DATA[helioIdx].helio!)}</text>
              </g>
            </motion.g>
          )}

          {/* points + value labels + year labels */}
          {DATA.map((d, i) => {
            const x = px(i), y = py(d.prod);
            return (
              <motion.g key={d.year}
                initial={{ opacity: 0, scale: 0.4 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.9 + i * 0.08 }} style={{ transformOrigin: `${x}px ${y}px` }}>
                {/* point */}
                <circle cx={x} cy={y} r="7" fill={d.forecast ? "var(--surface)" : "#0B1B33"} stroke={d.forecast ? "#34D399" : "#22D3EE"} strokeWidth={d.forecast ? 2 : 3}
                  strokeDasharray={d.forecast ? "3 3" : undefined} style={{ filter: "drop-shadow(0 0 5px rgba(34,211,238,0.8))" }} />
                <circle cx={x} cy={y} r="2.5" fill="#ffffff" />
                {/* value label */}
                <text x={x} y={y - 16} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--content)" className="font-display">{fmt(d.prod)}</text>
                {/* year label */}
                <text x={x} y={H - 18} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="var(--content-secondary)">{d.year}</text>
                {d.forecast && <text x={x} y={H - 5} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="var(--accent)" letterSpacing="0.06em">{tr(FORECAST, locale).toUpperCase()}</text>}
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-7 gap-y-2 mt-5 pl-2">
        <span className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--content-secondary)" }}>
          <span className="w-5 h-2 rounded-full" style={{ background: "linear-gradient(90deg,#3B82F6,#22D3EE,#34D399)", boxShadow: "0 0 8px rgba(34,211,238,0.6)" }} />
          {tr(LEG_PROD, locale)}
        </span>
        <span className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--content-secondary)" }}>
          <span className="w-3.5 h-3.5 rounded-full" style={{ background: "#F5B30B", boxShadow: "0 0 8px rgba(245,179,11,0.7)" }} />
          {tr(LEG_HELIO, locale)}
        </span>
      </div>
    </div>
  );
}
