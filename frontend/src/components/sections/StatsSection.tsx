"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Statistic } from "@/types/api";
import { staggerContainer, fadeUp, VIEWPORT } from "@/lib/motion";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount]   = useState(0);
  const ref                  = useRef<HTMLSpanElement>(null);
  const started              = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2200;
        const start    = performance.now();
        const tick = (now: number) => {
          const t    = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 4);
          setCount(Math.round(ease * target));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>;
}

interface Props { stats: Statistic[]; title: string; }

// Accent colors per card index (blue variants)
const ACCENTS = [
  { border: "rgba(62,106,153,0.35)",  glow: "rgba(62,106,153,0.15)",  icon: "rgba(62,106,153,0.18)"  },
  { border: "rgba(62,106,153,0.30)",  glow: "rgba(62,106,153,0.12)",  icon: "rgba(62,106,153,0.14)"  },
  { border: "rgba(81,127,176,0.30)",  glow: "rgba(81,127,176,0.12)",  icon: "rgba(81,127,176,0.14)"  },
  { border: "rgba(62,106,153,0.35)",  glow: "rgba(62,106,153,0.15)",  icon: "rgba(62,106,153,0.18)"  },
];

export function StatsSection({ stats, title }: Props) {
  return (
    <section className="relative py-24 overflow-hidden">

      {/* Top/bottom lines */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(62,106,153,0.30) 50%,transparent)" }} />
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(62,106,153,0.30) 50%,transparent)" }} />

      {/* Wide ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(62,106,153,0.07) 0%, transparent 70%)", filter: "blur(30px)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT} transition={{ duration: 0.5 }}
          className="text-center text-xs font-bold uppercase tracking-[0.22em] mb-12"
          style={{ color: "#94A3B8" }}
        >
          {title}
        </motion.p>

        {/* Cards */}
        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {stats.map((stat, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <motion.div
                key={stat.id}
                variants={fadeUp}
                className="group relative p-7 rounded-2xl text-center overflow-hidden cursor-default transition-transform duration-300 hover:-translate-y-1"
                style={{
                  background:           "rgba(247,249,252,0.70)",
                  border:               `1px solid ${accent.border}`,
                  backdropFilter:       "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow:            `0 4px 32px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.03)`,
                }}
              >
                {/* Hover top glow */}
                <div className="absolute top-0 inset-x-0 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${accent.glow} 0%, transparent 75%)` }} />

                {/* Top accent line */}
                <div className="absolute top-0 inset-x-8 h-px rounded-b"
                  style={{ background: `linear-gradient(90deg, transparent, ${accent.border}, transparent)` }} />

                {/* Icon */}
                {stat.icon && (
                  <div className="flex justify-center mb-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ background: accent.icon, border: `1px solid ${accent.border}` }}>
                      <DynamicIcon name={stat.icon} size={20} className="text-blue-400" />
                    </div>
                  </div>
                )}

                {/* Big number */}
                <div className="relative font-display font-bold leading-none mb-2 tabular-nums"
                  style={{
                    fontSize: "clamp(48px, 5vw, 72px)",
                    background: "linear-gradient(135deg, #3E6A99 0%, #3E6A99 55%, #517FB0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <div className="text-[13px] font-medium leading-snug" style={{ color: "#475569" }}>
                  {stat.label}
                </div>

                {/* Bottom glow on hover */}
                <div className="absolute bottom-0 inset-x-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: `linear-gradient(90deg, transparent, ${accent.border}, transparent)` }} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
