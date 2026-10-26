"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "./hooks";

const SIZE = 560;
const C = SIZE / 2;
const ORBIT_R = 238;
const ARC_R = 168;
const ARC_LEN = 2 * Math.PI * ARC_R;
const round = (n: number) => Math.round(n * 1000) / 1000;

/** Code-drawn instrument dial for the hero's empty right side: tick ring,
 * a filling gauge arc, and tech nodes orbiting the logo. */
export function HeroDial({ tags, run }: { tags: string[]; run: boolean }) {
  const reduce = useReducedMotion();
  const ticks = Array.from({ length: 72 }, (_, i) => i);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }} animate={run ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
      className="relative w-full max-w-[560px] aspect-square mx-auto select-none" aria-hidden>
      <div className="absolute inset-[12%] rounded-full" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.22), transparent 68%)", filter: "blur(30px)" }} />

      {/* Tick ring */}
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 w-full h-full animate-[orbit-cw_90s_linear_infinite] motion-reduce:animate-none">
        <circle cx={C} cy={C} r={262} fill="none" stroke="rgba(255,255,255,0.08)" />
        {ticks.map((i) => {
          const a = (i / ticks.length) * Math.PI * 2;
          const long = i % 6 === 0;
          const r1 = long ? 246 : 252;
          return (
            <line key={i}
              x1={round(C + r1 * Math.cos(a))} y1={round(C + r1 * Math.sin(a))}
              x2={round(C + 262 * Math.cos(a))} y2={round(C + 262 * Math.sin(a))}
              stroke={long ? "rgba(245,158,11,0.7)" : "rgba(255,255,255,0.22)"} strokeWidth={long ? 2 : 1} />
          );
        })}
      </svg>

      {/* Dashed counter-rotating ring */}
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 w-full h-full animate-[orbit-ccw_60s_linear_infinite] motion-reduce:animate-none">
        <circle cx={C} cy={C} r={204} fill="none" stroke="rgba(56,189,248,0.28)" strokeDasharray="2 10" strokeWidth={2} />
      </svg>

      {/* Gauge arc */}
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 w-full h-full -rotate-90">
        <defs>
          <linearGradient id="dial-arc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
        <circle cx={C} cy={C} r={ARC_R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={10} />
        <motion.circle cx={C} cy={C} r={ARC_R} fill="none" stroke="url(#dial-arc)" strokeWidth={10} strokeLinecap="round"
          strokeDasharray={ARC_LEN}
          initial={{ strokeDashoffset: ARC_LEN }} animate={run ? { strokeDashoffset: ARC_LEN * 0.22 } : {}}
          transition={{ duration: 2.2, delay: 0.8, ease: EASE }}
          style={{ filter: "drop-shadow(0 0 10px rgba(245,158,11,0.55))" }} />
      </svg>

      {/* Core */}
      <div className="absolute inset-[34%] rounded-full flex flex-col items-center justify-center"
        style={{ background: "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.10), rgba(255,255,255,0.02))", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(10px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)" }}>
        <motion.div animate={reduce ? undefined : { scale: [1, 1.05, 1] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}>
          <Image src="/logo-icon.png" alt="" width={84} height={84} className="object-contain w-[min(84px,12vw)] h-auto" priority />
        </motion.div>
        <span className="mt-2 font-display font-bold tracking-[0.3em] text-white" style={{ fontSize: "clamp(12px,1.1vw,16px)" }}>ICHAB</span>
      </div>

      {/* Orbiting tech nodes (ring turns, labels counter-turn to stay upright) */}
      <div className="absolute inset-0 animate-[orbit-cw_70s_linear_infinite] motion-reduce:animate-none">
        {tags.map((t, i) => {
          const a = (i / tags.length) * Math.PI * 2 - Math.PI / 2;
          const left = ((C + ORBIT_R * Math.cos(a)) / SIZE) * 100;
          const top = ((C + ORBIT_R * Math.sin(a)) / SIZE) * 100;
          return (
            <div key={t} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${round(left)}%`, top: `${round(top)}%` }}>
              <span className="block animate-[orbit-ccw_70s_linear_infinite] motion-reduce:animate-none">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[11px] font-bold tracking-wider whitespace-nowrap"
                  style={{ background: "rgba(8,18,38,0.85)", border: "1px solid rgba(255,255,255,0.16)", color: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)" }}>
                  <span className="w-1.5 h-1.5 rounded-full lab-active-dot" style={{ background: i % 2 ? "#38BDF8" : "#F59E0B" }} />
                  {t}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
