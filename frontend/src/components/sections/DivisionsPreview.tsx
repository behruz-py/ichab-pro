"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, FlaskConical, Cpu, Gauge, Activity, Cog, Zap, type LucideIcon } from "lucide-react";
import type { Division } from "@/types/api";
import { mediaUrl } from "@/lib/utils";
import { fadeLeft, VIEWPORT } from "@/lib/motion";

interface Props {
  divisions: Division[];
  locale: string;
  title: string;
  subtitle: string;
  viewAll: string;
  viewDetail: string;
}

const EYEBROW: Record<string, string> = { uz: "Bo'linmalar", ru: "Подразделения", en: "Divisions" };
const PLACEHOLDER_ICONS: LucideIcon[] = [FlaskConical, Cpu, Gauge, Activity, Cog, Zap];

function PanelMedia({ div, Icon, priority }: { div: Division; Icon: LucideIcon; priority: boolean }) {
  return div.cover_image ? (
    <Image
      src={mediaUrl(div.cover_image)}
      alt={div.name}
      fill
      className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
      sizes="(max-width:1024px) 100vw, 50vw"
      priority={priority}
    />
  ) : (
    <div className="absolute inset-0 flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #2F5E94 0%, #244C77 100%)" }}>
      <Icon size={64} strokeWidth={1.1} style={{ color: "rgba(255,255,255,0.30)" }} />
    </div>
  );
}

export function DivisionsPreview({ divisions, locale, title, subtitle, viewAll, viewDetail }: Props) {
  const shown = divisions.slice(0, 6);
  if (!shown.length) return null;

  return (
    <section className="relative py-20">
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(47,94,148,0.22) 50%,transparent)" }} />
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(47,94,148,0.12) 50%,transparent)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-5">
          <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: "#2F5E94" }}>
              {EYEBROW[locale] ?? EYEBROW.uz}
            </span>
            <h2 className="font-display font-bold text-content leading-tight" style={{ fontSize: "clamp(28px,3.5vw,44px)" }}>
              {title}
            </h2>
            <p className="mt-3 max-w-lg" style={{ color: "#475569" }}>{subtitle}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5, delay: 0.2 }}>
            <Link
              href={`/${locale}/divisions`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-all duration-200 hover:gap-3"
              style={{ background: "rgba(47,94,148,0.10)", border: "1px solid rgba(47,94,148,0.25)", color: "#2F5E94" }}
            >
              {viewAll} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* ── Desktop: interactive image accordion ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex gap-3"
          style={{ height: 460 }}
        >
          {shown.map((div, i) => {
            const Icon = PLACEHOLDER_ICONS[i % PLACEHOLDER_ICONS.length];
            return (
              <Link
                key={div.id}
                href={`/${locale}/divisions/${div.slug}`}
                className="group relative block rounded-2xl overflow-hidden flex-1 hover:flex-[3.2] transition-[flex-grow,flex-basis] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ minWidth: 64 }}
              >
                <PanelMedia div={div} Icon={Icon} priority={i < 3} />

                {/* Bottom gradient for legibility */}
                <div className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                  style={{ background: "linear-gradient(to top, rgba(8,14,28,0.94) 0%, rgba(8,14,28,0.45) 38%, rgba(8,14,28,0.05) 65%, transparent 80%)" }} />

                {/* Hover top accent line */}
                <span className="absolute top-0 inset-x-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(90deg, #2F5E94, #EA6E14)" }} />

                {/* LAB badge */}
                <span className="absolute top-3 left-3 z-10 font-mono text-[11px] font-bold tracking-widest px-2.5 py-1 rounded-lg whitespace-nowrap"
                  style={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(47,94,148,0.25)", color: "#2F5E94", backdropFilter: "blur(6px)" }}>
                  LAB · {String(i + 1).padStart(2, "0")}
                </span>

                {/* Collapsed: vertical title */}
                <div className="absolute bottom-5 left-0 right-0 flex justify-center px-2 group-hover:opacity-0 transition-opacity duration-200 pointer-events-none">
                  <span className="font-display font-semibold text-white text-[13px] tracking-wide"
                    style={{ writingMode: "vertical-rl", textShadow: "0 2px 8px rgba(0,0,0,0.7)", maxHeight: 280, overflow: "hidden" }}>
                    {div.name}
                  </span>
                </div>

                {/* Expanded: full content */}
                <div className="absolute bottom-0 inset-x-0 p-6 z-10 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100"
                  style={{ width: "min(440px, 92%)" }}>
                  <h3 className="font-display font-bold text-white leading-snug mb-2 first-letter:uppercase line-clamp-2"
                    style={{ fontSize: 19, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
                    {div.name}
                  </h3>
                  {div.short_description && (
                    <p className="text-sm leading-relaxed line-clamp-2 mb-3" style={{ color: "rgba(226,232,240,0.85)" }}>
                      {div.short_description}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg"
                    style={{ background: "linear-gradient(135deg, #EE8418, #D2630E)", color: "#fff", boxShadow: "0 6px 18px rgba(208,98,16,0.35)" }}>
                    {viewDetail} <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            );
          })}
        </motion.div>

        {/* ── Mobile / tablet: clean stacked cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-5">
          {shown.map((div, i) => {
            const Icon = PLACEHOLDER_ICONS[i % PLACEHOLDER_ICONS.length];
            return (
              <Link
                key={div.id}
                href={`/${locale}/divisions/${div.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ background: "var(--card-bg)", border: "1px solid var(--glass-border)", boxShadow: "var(--card-shadow)" }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <PanelMedia div={div} Icon={Icon} priority={i < 2} />
                  <span className="absolute top-3 left-3 font-mono text-[11px] font-bold tracking-widest px-2.5 py-1 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(47,94,148,0.25)", color: "#2F5E94" }}>
                    LAB · {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-col flex-1 p-4">
                  <h3 className="font-display font-bold text-base leading-snug mb-2 line-clamp-2 first-letter:uppercase" style={{ color: "#1E293B" }}>
                    {div.name}
                  </h3>
                  {div.short_description && (
                    <p className="text-sm leading-relaxed line-clamp-2 mb-4 flex-1" style={{ color: "#475569" }}>
                      {div.short_description}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold mt-auto" style={{ color: "#2F5E94" }}>
                    {viewDetail} <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
