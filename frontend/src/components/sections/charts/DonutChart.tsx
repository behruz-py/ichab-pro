"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export interface Seg { label: string; value: number }

const PALETTE = ["56,189,248", "139,92,246", "245,158,11", "16,185,129", "236,72,153", "59,130,246"];
const lighten = (rgb: string, f: number) => rgb.split(",").map((n) => Math.round(+n + (255 - +n) * f)).join(",");
const darken  = (rgb: string, f: number) => rgb.split(",").map((n) => Math.round(+n * f)).join(",");
const fmt = (n: number) => n.toLocaleString("ru-RU");

// elliptical 3D donut geometry (with room around it for outside labels)
const W = 250, H = 224, CX = 125, CY = 98;
const RX = 82, RY = 63, IRX = 49, IRY = 37, DEPTH = 15;

const ept = (cx: number, cy: number, ex: number, ey: number, a: number): [number, number] => [cx + ex * Math.cos(a), cy + ey * Math.sin(a)];
function sector(cy: number, a0: number, a1: number) {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = ept(CX, cy, RX, RY, a0), [x1, y1] = ept(CX, cy, RX, RY, a1);
  const [x2, y2] = ept(CX, cy, IRX, IRY, a1), [x3, y3] = ept(CX, cy, IRX, IRY, a0);
  return `M${x0},${y0} A${RX},${RY} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${IRX},${IRY} 0 ${large} 0 ${x3},${y3} Z`;
}

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

export function DonutChart({ title, total, unit, segments }: { title: string; total: number; unit: string; segments: Seg[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const totalV = useCountUp(total, inView);
  const uid = useId().replace(/:/g, "");

  let acc = -Math.PI / 2;
  const segs = segments.map((s, i) => {
    const a0 = acc, a1 = acc + (s.value / total) * Math.PI * 2;
    acc = a1;
    return { ...s, a0, a1, mid: (a0 + a1) / 2, rgb: PALETTE[i % PALETTE.length], pct: (s.value / total) * 100 };
  });

  let outIdx = 0; // stagger radius for small outside labels so they don't overlap

  return (
    <div ref={ref} className="glass-card rounded-2xl p-5 flex flex-col h-full" style={{ boxShadow: "var(--card-shadow)" }}>
      <h4 className="font-display font-bold text-content leading-snug mb-3" style={{ fontSize: 13.5, minHeight: 58 }}>{title}</h4>

      <div className="relative mx-auto" style={{ width: W, height: H }}>
        <motion.div initial={{ opacity: 0, scale: 0.82, rotate: -12 }} animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <defs>
              {segs.map((s, i) => (
                <linearGradient key={i} id={`dg-${uid}-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={`rgb(${lighten(s.rgb, 0.3)})`} />
                  <stop offset="100%" stopColor={`rgb(${s.rgb})`} />
                </linearGradient>
              ))}
            </defs>
            {/* 3D side (extruded base) */}
            <g>{segs.map((s, i) => <path key={i} d={sector(CY + DEPTH, s.a0, s.a1)} fill={`rgb(${darken(s.rgb, 0.48)})`} />)}</g>
            {/* top face */}
            <g style={{ filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.35))" }}>
              {segs.map((s, i) => <path key={i} d={sector(CY, s.a0, s.a1)} fill={`url(#dg-${uid}-${i})`} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />)}
            </g>
            {/* segment value labels */}
            <g>
              {segs.map((s, i) => {
                if (s.pct >= 8) {
                  // on the colored band
                  const [lx, ly] = ept(CX, CY, (RX + IRX) / 2, (RY + IRY) / 2, s.mid);
                  return (
                    <text key={i} x={lx} y={ly + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff"
                      stroke="rgba(8,16,30,0.55)" strokeWidth="3.5" strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
                      {fmt(s.value)}
                    </text>
                  );
                }
                // small slice → outside with a leader line (staggered outward)
                const off = 12 + outIdx * 16; outIdx++;
                const [ox, oy] = ept(CX, CY, RX + 1, RY + 1, s.mid);
                const [lx, ly] = ept(CX, CY, RX + off, RY + off, s.mid);
                const anchor = Math.cos(s.mid) > 0.25 ? "start" : Math.cos(s.mid) < -0.25 ? "end" : "middle";
                const dx = anchor === "start" ? 4 : anchor === "end" ? -4 : 0;
                return (
                  <g key={i}>
                    <line x1={ox} y1={oy} x2={lx} y2={ly} stroke={`rgba(${s.rgb},0.7)`} strokeWidth="1.2" />
                    <text x={lx + dx} y={ly + 3.5} textAnchor={anchor} fontSize="11" fontWeight="700" fill={`rgb(${lighten(s.rgb, 0.22)})`}>
                      {fmt(s.value)}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </motion.div>

        {/* center total */}
        <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none"
          style={{ left: CX, top: CY, transform: "translate(-50%,-50%)", width: IRX * 1.8 }}>
          <span className="font-display font-extrabold tabular-nums leading-none" style={{ fontSize: 18, color: "var(--content)" }}>{fmt(totalV)}</span>
          <span className="mt-0.5 font-semibold" style={{ fontSize: 9.5, color: "var(--content-muted)" }}>{unit}</span>
        </div>
      </div>

      {/* legend */}
      <ul className="mt-4 space-y-2 flex-1">
        {segs.map((s, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="mt-1 w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: `rgb(${s.rgb})`, boxShadow: `0 0 8px rgba(${s.rgb},0.6)` }} />
            <span className="flex-1 leading-snug" style={{ fontSize: 11.5, color: "var(--content-secondary)" }}>{s.label}</span>
            <span className="font-bold tabular-nums whitespace-nowrap" style={{ fontSize: 11.5, color: `rgb(${lighten(s.rgb, 0.18)})` }}>{fmt(s.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
