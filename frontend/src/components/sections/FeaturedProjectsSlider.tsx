"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import {
  ChevronLeft, ChevronRight, MapPin, CalendarDays, Building2,
  ArrowRight, ArrowUpRight, Factory, Cpu, Gauge, Radar, Boxes, Radio,
  type LucideIcon,
} from "lucide-react";
import type { Project } from "@/types/api";
import { formatDate } from "@/lib/utils";
import { fadeUp, VIEWPORT } from "@/lib/motion";

interface Props {
  projects: Project[];
  locale: string;
  title: string;
  subtitle: string;
  viewAll: string;
}

const EYEBROW: Record<string, string> = { uz: "Tanlangan loyihalar", ru: "Избранные проекты", en: "Featured projects" };
const LABEL_CLIENT: Record<string, string> = { uz: "Buyurtmachi", ru: "Заказчик", en: "Client" };
const LABEL_LOCATION: Record<string, string> = { uz: "Manzil", ru: "Объект", en: "Location" };
const LABEL_DATE: Record<string, string> = { uz: "Yakunlangan", ru: "Завершено", en: "Completed" };

// Rotating accent palette + watermark icon, keyed by slide index — mirrors the
// NEON-cycling pattern already used across the division/service previews.
const PALETTE = ["56,189,248", "16,185,129", "245,158,11", "236,72,153", "167,139,250", "248,113,113"];
const WATERMARKS: LucideIcon[] = [Factory, Cpu, Gauge, Radar, Boxes, Radio];

const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 350;
const AUTOPLAY_MS = 6000;

export function FeaturedProjectsSlider({ projects, locale, title, subtitle, viewAll }: Props) {
  const slides = projects.slice(0, 8);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const total = slides.length;

  const paginate = useCallback((dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + total) % total);
  }, [total]);

  const goTo = useCallback((i: number) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  }, [index]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, total, paginate]);

  const dragStartX = useRef(0);
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) paginate(1);
    else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) paginate(-1);
  };

  if (!total) return null;

  const current = slides[index];
  const c = PALETTE[index % PALETTE.length];
  const Watermark = WATERMARKS[index % WATERMARKS.length];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(var(--accent-rgb),0.22) 50%,transparent)" }} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[460px] rounded-full transition-colors duration-700"
          style={{ background: `radial-gradient(ellipse, rgba(${c},0.09) 0%, transparent 70%)`, filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-5">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: "var(--accent)" }}>
              {EYEBROW[locale] ?? EYEBROW.uz}
            </span>
            <h2 className="font-display font-bold text-content leading-tight" style={{ fontSize: "clamp(28px,3.5vw,44px)" }}>{title}</h2>
            <p className="mt-3 max-w-lg" style={{ color: "var(--content-secondary)" }}>{subtitle}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5, delay: 0.2 }}>
            <Link href={`/${locale}/projects`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-all duration-200 hover:gap-3"
              style={{ background: "rgba(var(--accent-rgb),0.10)", border: "1px solid rgba(var(--accent-rgb),0.25)", color: "var(--accent)" }}>
              {viewAll} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Slider stage */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT}
          className="relative rounded-[28px] overflow-hidden select-none"
          style={{
            background: "var(--card-bg)",
            border: `1px solid rgba(${c},0.28)`,
            boxShadow: `0 20px 60px rgba(${c},0.10)`,
            transition: "border-color 0.5s, box-shadow 0.5s",
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative min-h-[420px] sm:min-h-[400px] lg:min-h-[380px] overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={current.id}
                custom={direction}
                initial={{ x: direction > 0 ? 60 : -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -60 : 60, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragElastic={0.12}
                dragConstraints={{ left: 0, right: 0 }}
                onDragStart={() => { dragStartX.current = index; }}
                onDragEnd={onDragEnd}
                className="absolute inset-0 flex flex-col lg:flex-row cursor-grab active:cursor-grabbing"
              >
                {/* Text content */}
                <div className="flex-1 min-w-0 p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
                  <span className="inline-flex items-center gap-2 font-mono text-[13px] font-bold tracking-widest mb-4" style={{ color: `rgb(${c})` }}>
                    {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                  </span>
                  <h3 className="font-display font-bold leading-snug mb-5" style={{ fontSize: "clamp(20px,2.4vw,30px)", color: "var(--content)" }}>
                    {current.name}
                  </h3>

                  <div className="flex flex-wrap gap-x-7 gap-y-3 mb-5">
                    <div className="flex items-center gap-2">
                      <Building2 size={15} style={{ color: `rgb(${c})` }} />
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--content-muted)" }}>{LABEL_CLIENT[locale] ?? LABEL_CLIENT.uz}</div>
                        <div className="text-[13.5px] font-medium" style={{ color: "var(--content-secondary)" }}>{current.client}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={15} style={{ color: `rgb(${c})` }} />
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--content-muted)" }}>{LABEL_LOCATION[locale] ?? LABEL_LOCATION.uz}</div>
                        <div className="text-[13.5px] font-medium" style={{ color: "var(--content-secondary)" }}>{current.location}</div>
                      </div>
                    </div>
                    {current.completed_date && (
                      <div className="flex items-center gap-2">
                        <CalendarDays size={15} style={{ color: `rgb(${c})` }} />
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--content-muted)" }}>{LABEL_DATE[locale] ?? LABEL_DATE.uz}</div>
                          <div className="text-[13.5px] font-medium" style={{ color: "var(--content-secondary)" }}>{formatDate(current.completed_date, locale)}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {current.description && (
                    <p className="text-[14.5px] leading-relaxed line-clamp-3 max-w-xl" style={{ color: "var(--content-secondary)" }}>
                      {current.description}
                    </p>
                  )}
                </div>

                {/* Decorative technical panel */}
                <div className="hidden lg:flex relative w-[360px] flex-shrink-0 items-center justify-center overflow-hidden"
                  style={{ background: `linear-gradient(135deg, rgba(${c},0.10) 0%, transparent 70%)`, borderLeft: `1px solid rgba(${c},0.18)` }}>
                  <div className="absolute inset-0 pointer-events-none" aria-hidden
                    style={{
                      backgroundImage: `radial-gradient(rgba(${c},0.35) 1px, transparent 1px)`,
                      backgroundSize: "28px 28px",
                      maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)",
                      WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)",
                    }} />
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.14, 0.22, 0.14] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute rounded-full"
                    style={{ width: 220, height: 220, background: `rgb(${c})`, filter: "blur(60px)" }}
                  />
                  <Watermark size={128} strokeWidth={1} style={{ color: `rgb(${c})`, opacity: 0.5 }} />
                  <div className="spotlight-glass absolute flex items-center gap-2" style={{ right: 20, top: 24, padding: "8px 12px" }}>
                    <ArrowUpRight size={13} style={{ color: `rgb(${c})` }} />
                    <span className="text-[12px] font-bold tracking-wide" style={{ color: "var(--content)" }}>ASUTP · SCADA</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="relative z-10 flex items-center justify-between px-6 sm:px-8 py-4"
            style={{ borderTop: `1px solid rgba(${c},0.16)`, background: "rgba(var(--surface-2-rgb),0.35)" }}>
            <div className="flex items-center gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  aria-label={`${i + 1}`}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === index ? 22 : 7,
                    background: i === index ? `rgb(${c})` : "var(--border)",
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => paginate(-1)} aria-label="prev"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
                style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--content-secondary)" }}>
                <ChevronLeft size={17} />
              </button>
              <button onClick={() => paginate(1)} aria-label="next"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
                style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--content-secondary)" }}>
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
