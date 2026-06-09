"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Statistic } from "@/types/api";
import { staggerContainer, fadeUp, VIEWPORT } from "@/lib/motion";
import { MeshBlobs } from "@/components/ui/MeshBlobs";
import { ShimmerCard } from "@/components/ui/ShimmerCard";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2200;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - elapsed, 4);
            setCount(Math.round(ease * target));
            if (elapsed < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
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
      <MeshBlobs variant="stats" />

      {/* Top/bottom separator lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5 }}
          className="text-center text-content-muted text-xs font-semibold uppercase tracking-[0.2em] mb-12"
        >
          {title}
        </motion.p>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-2 md:grid-cols-4 gap-5"
        >
          {stats.map((stat, i) => (
            <motion.div key={stat.id} variants={fadeUp}>
              <ShimmerCard
                speed={i % 2 === 0 ? "slow" : "normal"}
                intensity="subtle"
              >
                <div className="p-6 text-center group cursor-default">
                  {stat.icon && (
                    <div className="flex justify-center mb-3 text-accent/60">
                      <DynamicIcon name={stat.icon} size={20} />
                    </div>
                  )}
                  <div className="font-display text-4xl md:text-5xl font-bold text-gradient mb-2 leading-none">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-content-muted text-sm font-medium leading-snug mt-1">
                    {stat.label}
                  </div>
                  {/* Bottom accent line */}
                  <motion.div
                    className="mx-auto mt-4 h-0.5 rounded-full bg-accent/40"
                    initial={{ width: 0 }}
                    whileInView={{ width: "40%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                  />
                </div>
              </ShimmerCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
