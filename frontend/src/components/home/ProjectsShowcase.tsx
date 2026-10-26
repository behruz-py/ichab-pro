"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Building2, MapPin, Factory } from "lucide-react";
import type { Project } from "@/types/api";
import { mediaUrl } from "@/lib/utils";
import { SectionLabel } from "@/components/editorial/SectionLabel";
import { EASE } from "@/components/editorial/hooks";

const PALETTE = ["56,189,248", "16,185,129", "245,158,11", "236,72,153", "139,92,246", "6,182,212"];
const UNIT: Record<string, string> = { uz: "ta loyiha", ru: "проектов", en: "projects" };
const CYCLE_MS = 6000;

const yearOf = (d: string | null) => (d ? new Date(d).getUTCFullYear() : null);
const imageOf = (p: Project) => p.main_image || p.images?.[0]?.image || null;

function Preview({ p, i }: { p: Project; i: number }) {
  const c = PALETTE[i % PALETTE.length];
  const [failed, setFailed] = useState(false);
  const img = failed ? null : imageOf(p);
  const year = yearOf(p.completed_date);
  return (
    <motion.div key={p.id} className="absolute inset-0"
      initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: EASE }}>
      {img ? (
        <Image src={mediaUrl(img)} alt={p.name} fill sizes="(max-width:1024px) 100vw, 58vw" className="object-cover" onError={() => setFailed(true)} />
      ) : (
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 70% at 75% 20%, rgba(${c},0.45), transparent 60%), linear-gradient(150deg, #0b1830, #050c1a)` }}>
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 70% 70% at 60% 40%, black, transparent)", WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 60% 40%, black, transparent)",
          }} />
          <Factory className="absolute right-[8%] top-[12%]" size={180} strokeWidth={0.7} style={{ color: `rgba(${c},0.35)` }} />
          {year && (
            <span className="absolute left-[7%] top-[8%] font-display font-bold leading-none tabular-nums"
              style={{ fontSize: "clamp(80px,9vw,150px)", WebkitTextStroke: `1.5px rgba(${c},0.55)`, WebkitTextFillColor: "transparent" }}>{year}</span>
          )}
        </div>
      )}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(3,8,20,0.92) 0%, rgba(3,8,20,0.35) 45%, transparent 70%)" }} />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9 text-white">
        {year && <span className="inline-block mb-3 px-2.5 py-1 rounded-md font-mono text-xs font-bold" style={{ background: `rgb(${c})`, color: "#06101f" }}>{year}</span>}
        <h3 className="font-display font-semibold leading-snug max-w-2xl" style={{ fontSize: "clamp(18px,1.7vw,26px)" }}>{p.name}</h3>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-white/75">
          {p.client && <span className="inline-flex items-center gap-1.5"><Building2 size={14} />{p.client}</span>}
          {p.location && <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{p.location}</span>}
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsShowcase({
  index, label, locale, projects, total, title, subtitle, viewAll,
}: {
  index: number; label: string; locale: string; projects: Project[]; total: number;
  title: string; subtitle: string; viewAll: string;
}) {
  // Projects with real photos lead the showcase.
  const shown = [...projects].sort((a, b) => Number(!!imageOf(b)) - Number(!!imageOf(a))).slice(0, 6);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const auto = inView && !held && !reduce && shown.length > 1;

  useEffect(() => {
    if (!auto) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % shown.length), CYCLE_MS);
    return () => clearTimeout(id);
  }, [auto, active, shown.length]);

  if (!shown.length) return null;
  const p = shown[active];

  return (
    <section ref={ref} className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <div className="grid lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8">
          <SectionLabel index={index} label={label} />
          <h2 className="font-display font-bold leading-[1.05] tracking-[-0.02em]" style={{ fontSize: "clamp(34px,4.2vw,64px)", color: "var(--content)" }}>{title}</h2>
          <p className="mt-3 max-w-xl" style={{ fontSize: 17, color: "var(--content-secondary)" }}>{subtitle}</p>
        </div>
        <div className="lg:col-span-4 lg:self-end flex items-end justify-between lg:justify-end gap-8">
          <div className="lg:text-right">
            <div className="font-display font-bold leading-none tabular-nums" style={{ fontSize: "clamp(44px,4.4vw,72px)", background: "var(--hero-accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{total}</div>
            <div className="text-xs uppercase tracking-[0.2em] mt-1" style={{ color: "var(--content-muted)" }}>{UNIT[locale] ?? UNIT.uz}</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-10" onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)}>
        {/* Preview */}
        <div className="lg:col-span-7 lg:order-2 relative overflow-hidden rounded-[28px] aspect-[4/3] lg:aspect-auto lg:min-h-[540px]"
          style={{ background: "#050c1a", boxShadow: "0 30px 80px rgba(0,0,0,0.25)" }}>
          <AnimatePresence initial={false}>
            <Preview key={p.id} p={p} i={active} />
          </AnimatePresence>
        </div>

        {/* Index */}
        <div className="lg:col-span-5 lg:order-1 flex flex-col">
          <ol style={{ borderTop: "1px solid var(--border)" }}>
            {shown.map((pr, i) => {
              const on = i === active;
              const c = PALETTE[i % PALETTE.length];
              return (
                <li key={pr.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <button type="button" onClick={() => { setActive(i); setHeld(true); }} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}
                    aria-pressed={on}
                    className="relative w-full text-left grid grid-cols-[auto,1fr] gap-4 py-4 sm:py-5 pr-2">
                    <span className="font-mono text-xs font-bold tabular-nums pt-1 transition-colors duration-300" style={{ color: on ? `rgb(${c})` : "var(--content-muted)" }}>
                      {yearOf(pr.completed_date) ?? String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-snug line-clamp-2 transition-all duration-300"
                      style={{ fontSize: "clamp(15px,1.15vw,17px)", fontWeight: on ? 600 : 500, color: on ? "var(--content)" : "var(--content-secondary)", transform: on ? "translateX(6px)" : "none" }}>
                      {pr.name}
                    </span>
                    {on && (
                      <span className="absolute left-0 right-0 -bottom-px h-[2px] overflow-hidden" aria-hidden>
                        <motion.span key={`${active}-${auto}`} className="block h-full origin-left" style={{ background: `rgb(${c})` }}
                          initial={{ scaleX: auto ? 0 : 1 }} animate={{ scaleX: 1 }}
                          transition={{ duration: auto ? CYCLE_MS / 1000 : 0, ease: "linear" }} />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
          <Link href={`/${locale}/projects`} className="group inline-flex items-center gap-2 mt-8 text-sm font-semibold self-start" style={{ color: "var(--accent)" }}>
            {viewAll} <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
