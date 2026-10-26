"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Building2, MapPin } from "lucide-react";
import type { Project } from "@/types/api";
import { SectionLabel } from "@/components/editorial/SectionLabel";

const PALETTE = ["56,189,248", "16,185,129", "245,158,11", "236,72,153", "139,92,246", "6,182,212"];
const UNIT: Record<string, string> = { uz: "ta loyiha", ru: "проектов", en: "projects" };
const HEADER_H = 64;

function yearOf(d: string | null) {
  return d ? new Date(d).getUTCFullYear() : null;
}

function Panel({ p, i, total, pinned }: { p: Project; i: number; total: number; pinned: boolean }) {
  const c = PALETTE[i % PALETTE.length];
  const year = yearOf(p.completed_date);
  return (
    <article
      className={`group relative shrink-0 flex flex-col justify-between rounded-[28px] p-7 sm:p-9 overflow-hidden snap-start ${pinned ? "w-[min(540px,40vw)]" : "w-[84vw] sm:w-[420px]"}`}
      style={{
        height: pinned ? "min(54vh, 520px)" : undefined,
        minHeight: pinned ? undefined : 400,
        background: `linear-gradient(160deg, rgba(${c},0.11), transparent 55%), var(--surface-card)`,
        border: `1px solid rgba(${c},0.24)`,
      }}
    >
      <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" style={{ background: `rgb(${c})` }} aria-hidden />
      <div className="flex items-start justify-between gap-4">
        {year ? (
          <span className="font-display font-bold tabular-nums leading-none transition-colors duration-500"
            style={{ fontSize: "clamp(56px,6vw,96px)", WebkitTextStroke: `1.5px rgba(${c},0.6)`, WebkitTextFillColor: "transparent" }}>
            {year}
          </span>
        ) : <span />}
        <span className="font-mono text-xs font-bold tracking-widest pt-2" style={{ color: `rgb(${c})` }}>
          {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div>
        <h3 className="font-display font-semibold leading-snug mb-6" style={{ fontSize: "clamp(18px,1.6vw,24px)", color: "var(--content)" }}>
          {p.name}
        </h3>
        <div className="space-y-2 pt-5 text-sm" style={{ borderTop: "1px solid var(--border)", color: "var(--content-secondary)" }}>
          {p.client && <p className="flex items-start gap-2"><Building2 size={15} className="mt-0.5 shrink-0" style={{ color: `rgb(${c})` }} />{p.client}</p>}
          {p.location && <p className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" style={{ color: `rgb(${c})` }} />{p.location}</p>}
        </div>
      </div>
    </article>
  );
}

/** Completed projects as a pinned horizontal gallery: vertical scroll drives
 * the track sideways on desktop; elsewhere it's a native swipe row. */
export function ProjectsHorizontal({
  index, label, locale, projects, total, title, subtitle, viewAll,
}: {
  index: number; label: string; locale: string; projects: Project[]; total: number;
  title: string; subtitle: string; viewAll: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [distance, setDistance] = useState(0);
  const pinned = distance > 0;
  const shown = projects.slice(0, 8);

  useEffect(() => {
    if (reduce) { setDistance(0); return; }
    const mq = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      const track = trackRef.current;
      if (!mq.matches || !track) { setDistance(0); return; }
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); mq.removeEventListener("change", measure); window.removeEventListener("resize", measure); };
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => -p * distance);

  return (
    <section ref={sectionRef} className="relative" style={pinned ? { height: `calc(100vh - ${HEADER_H}px + ${distance}px)` } : undefined}>
      <div className={pinned ? "sticky overflow-hidden flex flex-col justify-center" : "py-24 sm:py-32"}
        style={pinned ? { top: HEADER_H, height: `calc(100vh - ${HEADER_H}px)` } : undefined}>

        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel index={index} label={label} />
            <h2 className="font-display font-bold leading-[1.05] tracking-[-0.02em]" style={{ fontSize: "clamp(34px,4.2vw,64px)", color: "var(--content)" }}>{title}</h2>
            <p className="mt-3 max-w-xl" style={{ fontSize: 17, color: "var(--content-secondary)" }}>{subtitle}</p>
          </div>
          <div className="sm:text-right">
            <div className="font-display font-bold leading-none tabular-nums" style={{ fontSize: "clamp(48px,5vw,80px)", background: "var(--hero-accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{total}</div>
            <div className="text-xs uppercase tracking-[0.2em] mt-1" style={{ color: "var(--content-muted)" }}>{UNIT[locale] ?? UNIT.uz}</div>
          </div>
        </div>

        <motion.div
          ref={trackRef}
          style={pinned ? { x } : undefined}
          className={pinned
            ? "flex gap-6 w-max pr-[8vw] pl-[max(32px,calc((100vw-1600px)/2+32px))]"
            : "flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 sm:scroll-px-6 px-4 sm:px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"}
        >
          {shown.map((p, i) => <Panel key={p.id} p={p} i={i} total={shown.length} pinned={pinned} />)}

          <Link href={`/${locale}/projects`}
            className={`group shrink-0 snap-start flex flex-col justify-between rounded-[28px] p-7 sm:p-9 text-white ${pinned ? "w-[min(380px,30vw)]" : "w-[70vw] sm:w-[320px]"}`}
            style={{ height: pinned ? "min(54vh, 520px)" : undefined, minHeight: pinned ? undefined : 400, background: "var(--warm-btn)", boxShadow: "0 20px 50px rgba(var(--warm-glow),0.35)" }}>
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white/20 self-end transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight size={24} />
            </span>
            <span className="font-display font-bold leading-[1.05]" style={{ fontSize: "clamp(28px,2.6vw,40px)" }}>{viewAll}</span>
          </Link>
        </motion.div>

        {pinned && (
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <div className="relative h-px w-full" style={{ background: "var(--border)" }}>
              <motion.div className="absolute inset-0 origin-left" style={{ scaleX: scrollYProgress, background: "var(--hero-accent-gradient)" }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
