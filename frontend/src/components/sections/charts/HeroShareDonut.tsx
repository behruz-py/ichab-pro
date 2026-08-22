"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export interface ShareSeg { label: string; value: number; pct: string; rgb: string }

const lighten = (rgb: string, f: number) => rgb.split(",").map((n) => Math.round(+n + (255 - +n) * f)).join(",");
const darken = (rgb: string, f: number) => rgb.split(",").map((n) => Math.round(+n * f)).join(",");
const fmt = (n: number) => n.toLocaleString("ru-RU");

// big donut geometry
const W = 420, H = 380, CX = 210, CY = 162, RX = 162, RY = 126, IRX = 100, IRY = 78, DEPTH = 26, LAYERS = 28;
// Rounded so SSR and hydration always serialize the exact same path string —
// Math.sin/cos can differ in the last bit between Node's V8 and the browser's.
const round = (n: number) => Math.round(n * 1000) / 1000;
const ept = (cy: number, ex: number, ey: number, a: number): [number, number] => [round(CX + ex * Math.cos(a)), round(cy + ey * Math.sin(a))];
function sector(cy: number, a0: number, a1: number) {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = ept(cy, RX, RY, a0), [x1, y1] = ept(cy, RX, RY, a1);
  const [x2, y2] = ept(cy, IRX, IRY, a1), [x3, y3] = ept(cy, IRX, IRY, a0);
  return `M${x0},${y0} A${RX},${RY} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${IRX},${IRY} 0 ${large} 0 ${x3},${y3} Z`;
}

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

export function HeroShareDonut({ heading, total, unit, segments }: { heading: string; total: number; unit: string; segments: ShareSeg[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const totalV = useCountUp(total, inView);
  const uid = useId().replace(/:/g, "");

  let acc = -Math.PI / 2;
  const segs = segments.map((s) => {
    const a0 = acc, a1 = acc + (s.value / total) * Math.PI * 2;
    acc = a1;
    return { ...s, a0, a1, mid: (a0 + a1) / 2, pctNum: (s.value / total) * 100 };
  });

  return (
    <section ref={ref}>
      <div className="mb-6">
        <h3 className="font-display font-bold text-content leading-snug" style={{ fontSize: "clamp(20px,2.5vw,30px)" }}>{heading}</h3>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-10" style={{ boxShadow: "var(--card-shadow)" }}>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Big neon-glass 3D donut */}
          <div className="relative mx-auto w-full" style={{ maxWidth: W }}>
            <motion.div initial={{ opacity: 0, scale: 0.82, rotate: -14 }} animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
                <defs>
                  {segs.map((s, i) => (
                    <linearGradient key={i} id={`hs-${uid}-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={`rgba(${lighten(s.rgb, 0.4)},0.95)`} />
                      <stop offset="100%" stopColor={`rgba(${s.rgb},0.55)`} />
                    </linearGradient>
                  ))}
                </defs>
                {/* 3D extruded side wall — stacked layers (bottom → top) */}
                {Array.from({ length: LAYERS }).map((_, li) => {
                  const tt = li / (LAYERS - 1);
                  const cy = CY + DEPTH * (1 - tt);
                  const f = 0.38 + tt * 0.18;
                  return <g key={li}>{segs.map((s, i) => <path key={i} d={sector(cy, s.a0, s.a1)} fill={`rgb(${darken(s.rgb, f)})`} />)}</g>;
                })}
                {/* glass top face + neon edge + glow */}
                <g style={{ filter: "drop-shadow(0 10px 22px rgba(0,0,0,0.4))" }}>
                  {segs.map((s, i) => (
                    <path key={i} d={sector(CY, s.a0, s.a1)} fill={`url(#hs-${uid}-${i})`}
                      stroke={`rgb(${lighten(s.rgb, 0.25)})`} strokeWidth="1.5"
                      style={{ filter: `drop-shadow(0 0 7px rgba(${s.rgb},0.6))` }} />
                  ))}
                </g>
                {/* % on the band for non-tiny slices */}
                <g>
                  {segs.filter((s) => s.pctNum >= 5).map((s, i) => {
                    const [lx, ly] = ept(CY, (RX + IRX) / 2, (RY + IRY) / 2, s.mid);
                    return (
                      <text key={i} x={lx} y={ly + 6} textAnchor="middle" fontSize="17" fontWeight="800" fill="#fff"
                        stroke="rgba(8,16,30,0.5)" strokeWidth="4" strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
                        {s.pct}%
                      </text>
                    );
                  })}
                </g>
              </svg>
            </motion.div>
            {/* center total */}
            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none"
              style={{ left: `${(CX / W) * 100}%`, top: `${(CY / H) * 100}%`, transform: "translate(-50%,-50%)" }}>
              <span className="font-display font-extrabold tabular-nums leading-none" style={{ fontSize: 32, color: "var(--content)", textShadow: "0 0 18px rgba(56,189,248,0.5)" }}>{fmt(totalV)}</span>
              <span className="mt-1 font-semibold" style={{ fontSize: 12.5, color: "var(--content-muted)" }}>{unit}</span>
            </div>
          </div>

          {/* Legend */}
          <ul className="space-y-3.5">
            {segs.map((s, i) => (
              <motion.li key={i}
                initial={{ opacity: 0, x: 14 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-[rgba(56,189,248,0.07)]">
                <span className="w-4 h-4 rounded-md flex-shrink-0" style={{ background: `linear-gradient(135deg, rgb(${lighten(s.rgb, 0.2)}), rgb(${s.rgb}))`, boxShadow: `0 0 12px rgba(${s.rgb},0.7)` }} />
                <span className="flex-1 font-medium" style={{ fontSize: 15, color: "var(--content)" }}>{s.label}</span>
                <span className="font-bold tabular-nums whitespace-nowrap" style={{ fontSize: 14.5, color: `rgb(${lighten(s.rgb, 0.2)})` }}>
                  {fmt(s.value)} {unit} · {s.pct}%
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
