"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { EASE, useCountUp, useVisibleOnce } from "./hooks";
import { HeroDial } from "./HeroDial";

export interface HeroStat { value: number; label: string; suffix?: string }

function Stat({ s, i, run }: { s: HeroStat; i: number; run: boolean }) {
  const v = useCountUp(s.value, run, 1600 + i * 200);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={run ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 1.0 + i * 0.12, ease: EASE }}
      className="pr-4 sm:px-8 sm:py-2 sm:first:pl-0 sm:border-l sm:first:border-l-0 border-white/[0.12]"
    >
      <div className="font-display font-bold tabular-nums leading-none tracking-tight"
        style={{ fontSize: "clamp(34px,4.4vw,64px)", background: "linear-gradient(180deg,#fff 30%,rgba(255,255,255,0.55))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
        {v.toLocaleString("ru-RU")}<span style={{ WebkitTextFillColor: "#F59E0B" }}>{s.suffix ?? "+"}</span>
      </div>
      <p className="mt-2.5 text-[11px] sm:text-xs uppercase tracking-[0.16em] leading-snug" style={{ color: "rgba(255,255,255,0.55)" }}>{s.label}</p>
    </motion.div>
  );
}

const HIGHLIGHT = /avtomat|автомат|automat/i;

/** Full-viewport dark hero: masked word-by-word headline, mouse-reactive
 * aurora field, and a cardless stats ribbon along the bottom. */
export function EditorialHero({
  badge, title, uppercase, subtitle, stats, scrollLabel, actions, tags, dial,
}: {
  badge: string;
  title: string;
  uppercase?: boolean;
  subtitle?: string;
  stats: HeroStat[];
  scrollLabel: string;
  actions?: ReactNode;
  tags?: string[];
  /** Show the instrument dial on the right (desktop); tags then orbit it. */
  dial?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const ready = useVisibleOnce(ref);
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const sy = useSpring(my, { stiffness: 40, damping: 18 });
  const blobAx = useTransform(sx, (v) => v * 70);
  const blobAy = useTransform(sy, (v) => v * 50);
  const blobBx = useTransform(sx, (v) => v * -90);
  const blobBy = useTransform(sy, (v) => v * -60);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const words = title.split(/\s+/).filter(Boolean);
  const afterTitle = 0.6 + words.length * 0.05;

  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className="relative overflow-hidden flex flex-col"
      style={{ minHeight: "calc(100svh - 64px)", background: "#040b19" }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <motion.div className="absolute rounded-full" style={{ x: blobAx, y: blobAy, width: "62vw", height: "62vw", top: "-22vw", right: "-14vw", background: "radial-gradient(circle, rgba(245,158,11,0.32), transparent 62%)", filter: "blur(40px)" }} />
        <motion.div className="absolute rounded-full" style={{ x: blobBx, y: blobBy, width: "56vw", height: "56vw", bottom: "-26vw", left: "-16vw", background: "radial-gradient(circle, rgba(56,189,248,0.26), transparent 62%)", filter: "blur(44px)" }} />
        <div className="absolute rounded-full" style={{ width: "36vw", height: "36vw", top: "30%", left: "38%", background: "radial-gradient(circle, rgba(139,92,246,0.14), transparent 65%)", filter: "blur(50px)" }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 75% 65% at 50% 40%, black 20%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 40%, black 20%, transparent 100%)",
        }} />
        <div className="absolute bottom-0 inset-x-0 h-40" style={{ background: "linear-gradient(to bottom, transparent, #040b19)" }} />
      </div>

      <motion.div style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className={`relative z-10 flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 ${dial ? "grid lg:grid-cols-12 gap-10 items-center" : "flex flex-col justify-center"}`}>
       <div className={dial ? "lg:col-span-7 flex flex-col" : "contents"}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EASE }}
          className="inline-flex self-start items-center gap-2.5 mb-8 px-3.5 py-1.5 rounded-full"
          style={{ border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}>
          <span className="w-1.5 h-1.5 rounded-full lab-active-dot" style={{ background: "#F59E0B" }} />
          <span className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.75)" }}>{badge}</span>
        </motion.div>

        <h1 aria-label={title}
          className={`font-display font-bold text-white leading-[1.02] tracking-[-0.025em] ${uppercase ? "uppercase" : ""}`}
          style={{ fontSize: dial ? "clamp(30px, 4.3vw, 78px)" : uppercase ? "clamp(30px, 5.6vw, 96px)" : "clamp(38px, 6.4vw, 104px)" }}>
          {words.map((w, i) => (
            <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.1em] mr-[0.24em] last:mr-0">
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={ready ? { y: "0%" } : {}}
                transition={{ duration: 1, delay: 0.15 + i * 0.08, ease: EASE }}
                style={HIGHLIGHT.test(w) ? { background: "var(--hero-accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" } : undefined}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>

        {subtitle && (
          <motion.p initial={{ opacity: 0, y: 14 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: afterTitle, ease: EASE }}
            className="mt-8 max-w-2xl leading-relaxed" style={{ fontSize: "clamp(16px,1.35vw,20px)", color: "rgba(255,255,255,0.68)" }}>
            {subtitle}
          </motion.p>
        )}

        {actions && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: afterTitle + 0.15, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-4">
            {actions}
          </motion.div>
        )}

        {tags && tags.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: afterTitle + 0.35 }}
            className={`mt-10 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs font-semibold tracking-[0.18em] ${dial ? "lg:hidden" : ""}`} style={{ color: "rgba(255,255,255,0.55)" }}>
            {tags.map((t, i) => (
              <span key={t} className="inline-flex items-center gap-5">{t}{i < tags.length - 1 && <span style={{ color: "#F59E0B" }}>/</span>}</span>
            ))}
          </motion.div>
        )}
       </div>
        {dial && (
          <div className="hidden lg:block lg:col-span-5">
            <HeroDial tags={tags ?? []} run={ready} />
          </div>
        )}
      </motion.div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="h-px w-full mb-8" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))" }} />
        <div className="flex flex-wrap items-end justify-between gap-8">
          {stats.length > 0 && (
            <div className="grid grid-cols-2 gap-y-7 sm:flex sm:flex-wrap sm:gap-y-6">
              {stats.map((s, i) => <Stat key={s.label} s={s} i={i} run={ready} />)}
            </div>
          )}
          <motion.div initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 1.6, duration: 0.8 }}
            className="hidden md:flex items-center gap-3 text-[11px] uppercase tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.5)" }}>
            {scrollLabel}
            <span className="relative block w-px h-12 overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
              <motion.span className="absolute inset-x-0 top-0 h-1/2" style={{ background: "#F59E0B" }}
                animate={reduce ? undefined : { y: ["-100%", "200%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
