"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight, FlaskConical, Cpu, Gauge, Activity, Cog, Zap,
  type LucideIcon,
} from "lucide-react";
import type { Division } from "@/types/api";
import { mediaUrl } from "@/lib/utils";
import { staggerContainer, fadeUp, fadeLeft, VIEWPORT } from "@/lib/motion";

interface Props {
  divisions: Division[];
  locale: string;
  title: string;
  subtitle: string;
  viewAll: string;
  viewDetail: string;
}

const EYEBROW: Record<string, string> = { uz: "Bo'linmalar", ru: "Подразделения", en: "Divisions" };
const LAB: Record<string, string> = { uz: "Laboratoriya", ru: "Лаборатория", en: "Laboratory" };
const ICONS: LucideIcon[] = [FlaskConical, Cpu, Gauge, Activity, Cog, Zap];

// Distinct per-card hue (rgb triple) — blue, violet, emerald, amber, pink, cyan
const COLORS = ["59,130,246", "139,92,246", "16,185,129", "245,158,11", "236,72,153", "6,182,212"];

/** Cover image that quietly unmounts on load error, revealing the branded
 *  placeholder behind it (some divisions have missing image files on the server). */
function DivisionCover({ src, priority }: { src: string; priority: boolean }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <Image
      src={src}
      alt=""
      fill
      priority={priority}
      onError={() => setOk(false)}
      className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
    />
  );
}

export function DivisionsPreview({ divisions, locale, title, subtitle, viewAll, viewDetail }: Props) {
  const shown = divisions.slice(0, 6);
  if (!shown.length) return null;

  const lab = LAB[locale] ?? LAB.uz;

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(var(--accent-rgb),0.22) 50%,transparent)" }} />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[360px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(var(--accent-rgb),0.07) 0%, transparent 70%)", filter: "blur(40px)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-5">
          <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: "var(--accent)" }}>
              {EYEBROW[locale] ?? EYEBROW.uz}
            </span>
            <h2 className="font-display font-bold text-content leading-tight" style={{ fontSize: "clamp(28px,3.5vw,44px)" }}>{title}</h2>
            <p className="mt-3 max-w-lg" style={{ color: "var(--content-secondary)" }}>{subtitle}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5, delay: 0.2 }}>
            <Link href={`/${locale}/divisions`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-all duration-200 hover:gap-3"
              style={{ background: "rgba(var(--accent-rgb),0.10)", border: "1px solid rgba(var(--accent-rgb),0.25)", color: "var(--accent)" }}>
              {viewAll} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {shown.map((div, i) => {
            const Icon = ICONS[i % ICONS.length];
            const c = COLORS[i % COLORS.length];
            return (
              <motion.div
                key={div.id}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="group relative"
              >
                {/* Colored outer glow on hover (not clipped) */}
                <div className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `0 22px 50px rgba(${c},0.28)` }} />

                <Link
                  href={`/${locale}/divisions/${div.slug}`}
                  className="relative flex flex-col h-full rounded-2xl overflow-hidden"
                  style={{ background: "var(--card-bg)", border: `1px solid rgba(${c},0.18)`, boxShadow: "var(--card-shadow)" }}
                >
                  {/* Image / branded placeholder */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
                    {/* Always-present branded backdrop (shows if image is missing/fails) */}
                    <div className="absolute inset-0 flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, rgba(${c},0.92) 0%, rgba(${c},0.45) 100%)` }}>
                      <Icon size={52} color="rgba(255,255,255,0.9)" strokeWidth={1.2} />
                    </div>
                    {/* alt="" + onError → a broken image never spills its name onto the card */}
                    {div.cover_image && (
                      <DivisionCover src={mediaUrl(div.cover_image)} priority={i < 3} />
                    )}
                    {/* Legibility gradient */}
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(to top, rgba(2,10,26,0.88) 0%, rgba(2,10,26,0.30) 42%, transparent 68%)" }} />
                    {/* Number badge */}
                    <span className="absolute top-3 left-3 font-mono text-[11px] font-bold tracking-widest px-2.5 py-1 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.94)", color: `rgb(${c})` }}>
                      {lab} · {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* Title over the image */}
                    <h3 className="absolute bottom-3 left-4 right-4 font-display font-bold text-white text-[17px] leading-snug line-clamp-2 first-letter:uppercase"
                      style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
                      {div.name}
                    </h3>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-5">
                    {div.short_description && (
                      <p className="text-sm leading-relaxed line-clamp-2 mb-4 flex-1" style={{ color: "var(--content-secondary)" }}>
                        {div.short_description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold mt-auto transition-all duration-200 group-hover:gap-3"
                      style={{ color: `rgb(${c})` }}>
                      {viewDetail}
                      <span className="inline-flex w-6 h-6 rounded-full items-center justify-center transition-colors duration-200"
                        style={{ background: `rgba(${c},0.14)` }}>
                        <ArrowRight size={13} />
                      </span>
                    </span>
                  </div>

                  {/* Colored inset ring on hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ boxShadow: `inset 0 0 0 1.5px rgba(${c},0.55)` }} />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
