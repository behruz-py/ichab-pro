"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Factory, FlaskConical, Cpu, Gauge, Activity, Cog, Zap,
  ChevronDown, type LucideIcon,
} from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { CursorSpotlight } from "@/components/ui/CursorSpotlight";
import type { Division, PageContent } from "@/types/api";

type Loc = Record<string, string>;
const tr = (o: Loc, l: string) => o[l] ?? o.uz;

const PALETTE = ["56,189,248", "16,185,129", "139,92,246", "245,158,11", "236,72,153", "6,182,212"];
const ICONS: LucideIcon[] = [FlaskConical, Cpu, Gauge, Activity, Cog, Zap];

const T = {
  badge:        { uz: "KORXONA HAQIDA", ru: "О ПРЕДПРИЯТИИ", en: "ABOUT THE ENTERPRISE" },
  labs:         { uz: "Laboratoriya", ru: "Лаборатория", en: "Laboratory" },
  projects:     { uz: "Amalga oshirilgan loyiha", ru: "Реализованный проект", en: "Completed project" },
  partners:     { uz: "Ishonchli hamkor", ru: "Надёжный партнёр", en: "Trusted partner" },
  readMore:     { uz: "Batafsil o'qish", ru: "Читать полностью", en: "Read more" },
  readLess:     { uz: "Yig'ish", ru: "Свернуть", en: "Show less" },
  directions:   { uz: "Yo'nalishlarimiz", ru: "Наши направления", en: "Our directions" },
  directionsSub:{ uz: "Har bir laboratoriya o'z sohasida ixtisoslashgan — batafsil tanishing.", ru: "Каждая лаборатория специализируется в своей области — узнайте подробнее.", en: "Each laboratory specializes in its own field — explore in detail." },
  viewAll:      { uz: "Barcha laboratoriyalar", ru: "Все лаборатории", en: "All laboratories" },
  ctaTitle:     { uz: "Biz bilan hamkorlik qiling", ru: "Сотрудничайте с нами", en: "Partner with us" },
  ctaText:      { uz: "Loyihangiz uchun ICHAB mutaxassislari bilan bog'laning.", ru: "Свяжитесь со специалистами ICHAB по вашему проекту.", en: "Get in touch with ICHAB specialists about your project." },
  ctaBtn:       { uz: "Bog'lanish", ru: "Связаться", en: "Contact us" },
} satisfies Record<string, Loc>;

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function useCountUp(target: number, run: boolean, dur = 1500) {
  const [v, setV] = useState(0);
  const started = useRef(false);
  const raf = useRef(0);
  if (run && !started.current) {
    started.current = true;
    if (typeof window !== "undefined") {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setV(target);
      } else {
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - t0) / dur, 1);
          setV(Math.round((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
      }
    }
  }
  return v;
}

function TrustNumber({ value, label, rgb, i, inView }: { value: number; label: string; rgb: string; i: number; inView: boolean }) {
  const v = useCountUp(value, inView, 1400 + i * 150);
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
      className="glass-card rounded-2xl p-5 sm:p-6 text-center" style={{ border: `1px solid rgba(${rgb},0.25)`, boxShadow: `var(--card-shadow), 0 0 24px rgba(${rgb},0.10)` }}>
      <div className="font-display font-extrabold tabular-nums leading-none" style={{ fontSize: "clamp(28px,3.6vw,40px)", color: `rgb(${rgb})`, textShadow: `0 0 24px rgba(${rgb},0.35)` }}>
        {v}+
      </div>
      <p className="text-xs sm:text-[14.5px] mt-2.5 leading-snug" style={{ color: "var(--content-muted)" }}>{label}</p>
    </motion.div>
  );
}

export interface TrustStat { value: number; label: string }

export function AboutShowcase({
  locale, mission, vision, history, divisions, trustStats,
}: {
  locale: string;
  mission: PageContent | null;
  vision: PageContent | null;
  history: PageContent | null;
  divisions: Division[];
  trustStats: TrustStat[];
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = (mission?.body?.length ?? 0) > 320;
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-40px" });
  const shownDivisions = divisions.slice(0, 6);
  // Literal classes (not interpolated) so Tailwind's scanner picks them up,
  // and the grid always exactly fits however many real stats exist —
  // no empty trailing column when a metric (e.g. projects) is 0 and hidden.
  const statsColsClass =
    trustStats.length >= 4 ? "grid-cols-2 sm:grid-cols-4" :
    trustStats.length === 3 ? "grid-cols-3" :
    "grid-cols-2";

  return (
    <div className="lab-page relative">
      <CursorSpotlight />

      {/* ── Cinematic hero ── */}
      <div className="relative overflow-hidden" style={{ height: "clamp(320px, 44vh, 480px)" }}>
        {mission?.image ? (
          <Image src={mission.image} alt={mission.title || "ICHAB"} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0" style={{
            backgroundImage: [
              "radial-gradient(ellipse 60% 90% at 80% 0%, rgba(56,189,248,0.30), transparent 60%)",
              "radial-gradient(ellipse 50% 80% at 10% 100%, rgba(16,185,129,0.18), transparent 55%)",
              "linear-gradient(135deg, #0a1f3a 0%, #061631 60%, #04101f 100%)",
            ].join(", "),
          }} />
        )}
        <div className="hero-scan-line" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(4,12,26,0.35) 0%, rgba(4,12,26,0.55) 50%, rgba(4,12,26,0.96) 100%)" }} />

        <div className="absolute bottom-0 inset-x-0 px-4 sm:px-6 lg:px-8 pb-10 max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl mb-4" style={{ background: "rgba(4,12,26,0.82)", border: "1px solid rgba(56,189,248,0.4)", backdropFilter: "blur(8px)" }}>
            <span className="w-1.5 h-1.5 rounded-full lab-active-dot" style={{ background: "#22C55E" }} />
            <span className="font-mono text-[13px] font-bold tracking-widest" style={{ color: "#7dd3fc" }}>{tr(T.badge, locale)}</span>
          </div>
          <h1 className="font-display font-bold text-white leading-tight max-w-3xl" style={{ fontSize: "clamp(26px, 4vw, 48px)", textShadow: "0 2px 20px rgba(0,0,0,0.6)" }}>
            {mission?.title || "ICHAB"}
          </h1>
          {mission?.subtitle && (
            <p className="mt-3 max-w-2xl text-white/85" style={{ fontSize: "clamp(14px,1.4vw,17px)", textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}>{mission.subtitle}</p>
          )}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">

        {/* Trust numbers */}
        {trustStats.length > 0 && (
          <div ref={statsRef} className={`grid gap-3 sm:gap-4 -mt-16 sm:-mt-20 relative z-10 max-w-2xl mx-auto ${statsColsClass}`}>
            {trustStats.map((s, i) => (
              <TrustNumber key={s.label} value={s.value} label={s.label} rgb={PALETTE[i % PALETTE.length]} i={i} inView={statsInView} />
            ))}
          </div>
        )}

        {/* Mission body */}
        {mission?.body && (
          <Reveal>
            <div className="glass-card rounded-2xl p-6 sm:p-8" style={{ boxShadow: "var(--card-shadow)" }}>
              <p
                className="text-sm sm:text-[15px] leading-[1.9] whitespace-pre-line"
                style={{
                  color: "var(--content-secondary)",
                  ...(isLong && !expanded
                    ? { display: "-webkit-box", WebkitBoxOrient: "vertical" as const, WebkitLineClamp: 5, overflow: "hidden" }
                    : {}),
                }}
              >
                {mission.body}
              </p>
              {isLong && (
                <button onClick={() => setExpanded((v) => !v)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80" style={{ color: "var(--accent)" }}>
                  {expanded ? tr(T.readLess, locale) : tr(T.readMore, locale)}
                  <ChevronDown size={16} className="transition-transform duration-300" style={{ transform: expanded ? "rotate(180deg)" : "none" }} />
                </button>
              )}
            </div>
          </Reveal>
        )}

        {/* Vision */}
        {vision?.body && (
          <Reveal>
            <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden" style={{ border: "1px solid rgba(139,92,246,0.22)", boxShadow: "var(--card-shadow)" }}>
              {vision.title && (
                <h2 className="font-display text-xl sm:text-2xl font-bold text-content mb-3 flex items-center gap-3">
                  <span className="w-1 h-7 rounded-full" style={{ background: "rgb(139,92,246)" }} />
                  {vision.title}
                </h2>
              )}
              {vision.subtitle && <p className="text-content-secondary text-base sm:text-lg mb-4 leading-relaxed">{vision.subtitle}</p>}
              <p className="text-sm sm:text-[15px] leading-[1.9] whitespace-pre-line" style={{ color: "var(--content-secondary)" }}>{vision.body}</p>
            </div>
          </Reveal>
        )}

        {/* History */}
        {history?.body && (
          <Reveal>
            <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden" style={{ border: "1px solid rgba(245,158,11,0.22)", boxShadow: "var(--card-shadow)" }}>
              {history.title && (
                <h2 className="font-display text-xl sm:text-2xl font-bold text-content mb-3 flex items-center gap-3">
                  <span className="w-1 h-7 rounded-full" style={{ background: "rgb(245,158,11)" }} />
                  {history.title}
                </h2>
              )}
              {history.subtitle && <p className="text-content-secondary text-base sm:text-lg mb-4 leading-relaxed">{history.subtitle}</p>}
              <p className="text-sm sm:text-[15px] leading-[1.9] whitespace-pre-line" style={{ color: "var(--content-secondary)" }}>{history.body}</p>
            </div>
          </Reveal>
        )}

        {/* Directions / divisions teaser */}
        {shownDivisions.length > 0 && (
          <section>
            <Reveal>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-7 gap-4">
                <div>
                  <h2 className="font-display font-bold text-content leading-tight" style={{ fontSize: "clamp(22px,2.8vw,32px)" }}>{tr(T.directions, locale)}</h2>
                  <p className="mt-2 max-w-lg" style={{ color: "var(--content-secondary)" }}>{tr(T.directionsSub, locale)}</p>
                </div>
                <Link href={`/${locale}/divisions`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-all duration-200 hover:gap-3"
                  style={{ background: "rgba(var(--accent-rgb),0.10)", border: "1px solid rgba(var(--accent-rgb),0.25)", color: "var(--accent)" }}>
                  {tr(T.viewAll, locale)} <ArrowRight size={16} />
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shownDivisions.map((div, i) => {
                const rgb = PALETTE[i % PALETTE.length];
                const Icon = ICONS[i % ICONS.length];
                return (
                  <Reveal key={div.id} delay={i * 0.06}>
                    <TiltCard style={{ border: `1px solid rgba(${rgb},0.22)`, boxShadow: "var(--card-shadow)" }} className="group glass-card rounded-2xl p-5 h-full block relative overflow-hidden" intensity={5}>
                      <Link href={`/${locale}/divisions/${div.slug}`} className="flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `rgba(${rgb},0.14)`, border: `1px solid rgba(${rgb},0.3)` }}>
                            <Icon size={20} style={{ color: `rgb(${rgb})` }} />
                          </div>
                          <ArrowUpRight size={16} style={{ color: `rgb(${rgb})` }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="font-display font-bold text-content leading-snug mb-2 first-letter:uppercase" style={{ fontSize: 15.5 }}>{div.name}</h3>
                        <p className="text-sm leading-relaxed line-clamp-3 flex-1" style={{ color: "var(--content-secondary)" }}>{div.short_description}</p>
                      </Link>
                    </TiltCard>
                  </Reveal>
                );
              })}
            </div>
          </section>
        )}

        {/* CTA */}
        <Reveal>
          <div className="cta-flow-border">
            <div className="rounded-3xl p-8 sm:p-12 text-center" style={{ background: "var(--card-solid)", backdropFilter: "blur(20px)" }}>
              <Factory size={34} strokeWidth={1.5} className="mx-auto mb-4" style={{ color: "var(--accent)" }} />
              <h2 className="font-display font-bold text-content mb-3" style={{ fontSize: "clamp(22px,3vw,34px)" }}>{tr(T.ctaTitle, locale)}</h2>
              <p className="mb-7 max-w-xl mx-auto" style={{ color: "var(--content-secondary)" }}>{tr(T.ctaText, locale)}</p>
              <Link href={`/${locale}/contact`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white" style={{ background: "var(--warm-btn)", boxShadow: "0 8px 24px rgba(var(--warm-glow),0.34)" }}>
                {tr(T.ctaBtn, locale)} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
