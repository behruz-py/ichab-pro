"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Statistic } from "@/types/api";
import { VIEWPORT } from "@/lib/motion";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref     = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2400;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 4);
            setCount(Math.round(ease * target));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

interface Props {
  stats: Statistic[];
  title: string;
}

export function StatsSection({ stats, title }: Props) {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Top/bottom hairlines */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.30) 50%, transparent 100%)" }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.30) 50%, transparent 100%)" }}
      />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)", filter: "blur(20px)" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5 }}
          className="text-center text-xs font-bold uppercase tracking-[0.22em] mb-14"
          style={{ color: "#344768" }}
        >
          {title}
        </motion.p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ delay: i * 0.10, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={`
                text-center px-6 py-10 group cursor-default
                ${i < stats.length - 1 ? "border-r border-white/[0.05]" : ""}
              `}
            >
              {/* Icon */}
              {stat.icon && (
                <div className="flex justify-center mb-5">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "rgba(59,130,246,0.09)",
                      border: "1px solid rgba(59,130,246,0.20)",
                    }}
                  >
                    <DynamicIcon name={stat.icon} size={20} className="text-blue-400" />
                  </div>
                </div>
              )}

              {/* Big number */}
              <div
                className="font-display font-bold leading-none mb-3 tabular-nums"
                style={{
                  fontSize: "clamp(44px, 5vw, 68px)",
                  background: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #38BDF8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <div className="text-sm font-medium" style={{ color: "#7B93B8" }}>
                {stat.label}
              </div>

              {/* Animated underline */}
              <motion.div
                className="mx-auto mt-5 h-px rounded-full"
                style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.50), transparent)" }}
                initial={{ width: 0 }}
                whileInView={{ width: "60%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.4 + i * 0.10 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
