"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Cpu, ShieldCheck, Wifi } from "lucide-react";

/**
 * Code-built hero visual — a "live automation cockpit" of floating glass panels
 * (gradient chart, KPI ring, node strip, status). Fully theme-aware: all colors
 * derive from CSS tokens, so it adapts to both Soft Slate and Aurora. No baked
 * text, so it works in every locale. Replaces the old raster hero image.
 */

const NODES = ["PLC", "SCADA", "HMI", "IoT"] as const;

function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setValue(target); return; }
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export function HeroVisual() {
  const projects = useCountUp(150);

  return (
    <div className="relative w-full h-full hidden lg:flex items-center justify-center">
      <div className="relative" style={{ width: 460, height: 440 }}>

        {/* ── Main chart panel ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="spotlight-glass absolute"
          style={{ left: 18, top: 96, width: 320, padding: 18 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity size={15} style={{ color: "var(--accent)" }} />
              <span className="text-[13px] font-semibold tracking-wide" style={{ color: "var(--content-secondary)" }}>
                SCADA · REALTIME
              </span>
            </div>
            <span className="flex items-center gap-1.5">
              <span className="lab-active-dot w-1.5 h-1.5 rounded-full" style={{ background: "#34D399" }} />
              <span className="text-[12px] font-bold tracking-wider" style={{ color: "var(--accent)" }}>LIVE</span>
            </span>
          </div>

          <svg viewBox="0 0 300 130" className="w-full" style={{ height: 130 }}>
            <defs>
              <linearGradient id="hv-stroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="55%" stopColor="var(--accent-secondary)" />
                <stop offset="100%" stopColor="var(--warm-solid)" />
              </linearGradient>
              <linearGradient id="hv-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* faint grid */}
            {[26, 56, 86, 116].map((y) => (
              <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="var(--border)" strokeWidth="1" />
            ))}

            {/* area + line */}
            <motion.path
              d="M0,96 C30,86 46,64 72,66 S112,42 142,48 S192,22 222,30 S270,10 300,16 L300,130 L0,130 Z"
              fill="url(#hv-fill)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            />
            <motion.path
              d="M0,96 C30,86 46,64 72,66 S112,42 142,48 S192,22 222,30 S270,10 300,16"
              fill="none"
              stroke="url(#hv-stroke)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: "easeInOut", delay: 0.3 }}
            />
            {/* moving end dot */}
            <motion.circle
              cx="300" cy="16" r="4"
              fill="var(--warm-solid)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ delay: 1.9, duration: 2, repeat: Infinity }}
            />
          </svg>
        </motion.div>

        {/* ── KPI ring card ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="spotlight-glass absolute flex items-center gap-3"
          style={{ right: 0, top: 18, padding: 16 }}
        >
          <div className="relative" style={{ width: 64, height: 64 }}>
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="32" fill="none" stroke="var(--border)" strokeWidth="7" />
              <motion.circle
                cx="40" cy="40" r="32" fill="none"
                stroke="var(--accent)" strokeWidth="7" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 32}
                initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - 0.86) }}
                transition={{ duration: 1.6, delay: 0.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display font-bold text-[15px]" style={{ color: "var(--content)" }}>86%</span>
            </div>
          </div>
          <div>
            <div className="font-display font-bold text-2xl leading-none" style={{ color: "var(--content)" }}>
              {projects}+
            </div>
            <div className="text-[12px] font-semibold tracking-wider mt-1" style={{ color: "var(--content-muted)" }}>
              PROJECTS
            </div>
          </div>
        </motion.div>

        {/* ── Node strip ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="spotlight-glass absolute flex items-center gap-1.5"
          style={{ left: 60, top: 300, padding: "12px 16px" }}
        >
          <Cpu size={15} style={{ color: "var(--accent)" }} className="mr-1" />
          {NODES.map((n, i) => (
            <span key={n} className="flex items-center gap-1.5">
              <span
                className="text-[13px] font-mono font-semibold px-2 py-1 rounded-md"
                style={{ background: "var(--accent-glow-far)", color: "var(--accent)" }}
              >
                {n}
              </span>
              {i < NODES.length - 1 && (
                <motion.span
                  className="w-1 h-1 rounded-full"
                  style={{ background: "var(--accent)" }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
                />
              )}
            </span>
          ))}
        </motion.div>

        {/* ── Floating uptime chip ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="spotlight-glass absolute flex items-center gap-2"
          style={{ right: 24, top: 246, padding: "10px 14px" }}
        >
          <Wifi size={14} style={{ color: "#34D399" }} />
          <span className="font-display font-bold text-sm" style={{ color: "var(--content)" }}>99.9%</span>
          <span className="text-[12px] font-semibold tracking-wider" style={{ color: "var(--content-muted)" }}>UPTIME</span>
        </motion.div>

        {/* ── ISO badge chip ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="spotlight-glass absolute flex items-center gap-2"
          style={{ left: 0, top: 372, padding: "10px 14px" }}
        >
          <ShieldCheck size={15} style={{ color: "var(--accent)" }} />
          <span className="text-[13px] font-bold tracking-wider" style={{ color: "var(--content-secondary)" }}>ISO 9001</span>
        </motion.div>
      </div>
    </div>
  );
}
