"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight, Factory, FlaskConical, Cpu, Gauge, Activity, Cog, Zap, type LucideIcon } from "lucide-react";
import type { Division } from "@/types/api";
import { DEPT_CODE, EASE, PALETTE, structureSub, T, tr } from "./copy";
import { SectionLabel } from "@/components/editorial/SectionLabel";

const ICONS: LucideIcon[] = [FlaskConical, Cpu, Gauge, Activity, Cog, Zap];

/** Divisions as an editorial index: full-width rows with the official name,
 * a color wipe on hover and a floating preview badge that trails the cursor. */
export function StructureIndex({ index, locale, divisions }: { index: number; locale: string; divisions: Division[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const px = useSpring(x, { stiffness: 220, damping: 24 });
  const py = useSpring(y, { stiffness: 220, damping: 24 });
  const ActiveIcon = active !== null ? ICONS[active % ICONS.length] : null;
  const activeRgb = active !== null ? PALETTE[active % PALETTE.length] : PALETTE[0];

  return (
    <section className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <div className="grid lg:grid-cols-12 gap-8 mb-14">
        <div className="lg:col-span-7">
          <SectionLabel index={index} label={tr(T.structure, locale)} />
          <h2 className="font-display font-bold leading-[1.05] tracking-[-0.02em]" style={{ fontSize: "clamp(34px,4.2vw,64px)", color: "var(--content)" }}>
            {tr(T.structureTitle, locale)}
          </h2>
        </div>
        <div className="lg:col-span-5 lg:self-end">
          <div className="inline-flex items-center gap-2.5 mb-4 px-3.5 py-2 rounded-full" style={{ border: "1px solid var(--border)" }}>
            <Factory size={16} style={{ color: "var(--accent)" }} />
            <span className="text-sm font-semibold" style={{ color: "var(--content)" }}>{tr(T.hub, locale)}</span>
          </div>
          <p className="leading-relaxed" style={{ fontSize: 17, color: "var(--content-secondary)" }}>{structureSub(divisions.length, locale)}</p>
        </div>
      </div>

      <div
        className="relative"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          x.set(e.clientX - r.left);
          y.set(e.clientY - r.top);
        }}
        onMouseLeave={() => setActive(null)}
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {!reduce && (
          <AnimatePresence>
            {ActiveIcon && (
              <motion.div
                key="preview"
                className="hidden lg:flex absolute left-0 top-0 z-20 pointer-events-none items-center justify-center rounded-full"
                style={{ x: px, y: py, translateX: "-50%", translateY: "-50%", width: 132, height: 132,
                  background: `radial-gradient(circle at 35% 30%, rgba(${activeRgb},0.95), rgba(${activeRgb},0.55))`,
                  boxShadow: `0 20px 60px rgba(${activeRgb},0.45)` }}
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <ActiveIcon size={46} color="#fff" strokeWidth={1.6} />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {divisions.map((div, i) => {
          const rgb = PALETTE[i % PALETTE.length];
          const code = DEPT_CODE[div.slug];
          const isActive = active === i;
          return (
            <motion.div key={div.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}>
              <Link
                href={`/${locale}/divisions/${div.slug}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group relative grid grid-cols-[auto,1fr,auto] lg:grid-cols-[64px,170px,1fr,auto] items-center gap-x-5 lg:gap-x-8 gap-y-2 py-6 sm:py-7 px-2 sm:px-4 overflow-hidden"
                style={{ borderBottom: "1px solid var(--border)", "--c": rgb } as CSSProperties}
              >
                {/* Color wipe + edge bar */}
                <span className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] bg-[rgba(var(--c),0.08)]" aria-hidden />
                <span className="absolute left-0 inset-y-0 w-[3px] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 bg-[rgb(var(--c))]" aria-hidden />

                <span className="relative font-mono text-sm font-bold tabular-nums transition-colors duration-300"
                  style={{ color: isActive ? `rgb(${rgb})` : "var(--content-muted)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="relative hidden lg:block">
                  {code && (
                    <span className="inline-block font-mono text-[12px] font-bold tracking-wide px-2.5 py-1 rounded-md"
                      style={{ color: `rgb(${rgb})`, background: `rgba(${rgb},0.12)` }}>{code}</span>
                  )}
                </span>

                <span className="relative min-w-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
                  {code && (
                    <span className="lg:hidden inline-block mb-1.5 font-mono text-[11px] font-bold tracking-wide px-2 py-0.5 rounded"
                      style={{ color: `rgb(${rgb})`, background: `rgba(${rgb},0.12)` }}>{code}</span>
                  )}
                  <span className="block font-display font-semibold leading-snug first-letter:uppercase"
                    style={{ fontSize: "clamp(17px,1.7vw,26px)", color: "var(--content)" }}>{div.name}</span>
                  {div.short_description && (
                    <span className="block mt-1.5 text-sm leading-relaxed line-clamp-2" style={{ color: "var(--content-secondary)" }}>{div.short_description}</span>
                  )}
                </span>

                <span className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border transition-all duration-500 group-hover:rotate-45 group-hover:bg-[rgb(var(--c))] group-hover:border-transparent"
                  style={{ borderColor: "var(--border)" }}>
                  <ArrowUpRight size={18} className="transition-colors duration-300 group-hover:text-white" style={{ color: isActive ? undefined : "var(--content-secondary)" }} />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
