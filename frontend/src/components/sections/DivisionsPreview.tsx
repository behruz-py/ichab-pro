"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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

const BOX = 600;          // diagram canvas size
const C = BOX / 2;        // center
const R = 216;            // node orbit radius
const NODE = 92;          // node diameter

function nodePos(i: number, n: number) {
  const a = (-90 + (360 / n) * i) * (Math.PI / 180);
  return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) };
}

function NodeMedia({ div, Icon }: { div: Division; Icon: LucideIcon }) {
  return div.cover_image ? (
    <Image src={mediaUrl(div.cover_image)} alt={div.name} fill className="object-cover" sizes="92px" />
  ) : (
    <div className="absolute inset-0 flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #3D72AD, #244C77)" }}>
      <Icon size={30} strokeWidth={1.4} color="rgba(255,255,255,0.85)" />
    </div>
  );
}

export function DivisionsPreview({ divisions, locale, title, subtitle, viewAll, viewDetail }: Props) {
  const shown = divisions.slice(0, 6);
  const [active, setActive] = useState<number | null>(null);
  if (!shown.length) return null;

  const n = shown.length;
  const act = active !== null ? shown[active] : null;

  return (
    <section className="relative py-20">
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(47,94,148,0.22) 50%,transparent)" }} />
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(47,94,148,0.12) 50%,transparent)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-5">
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
            <Link href={`/${locale}/divisions`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-all duration-200 hover:gap-3"
              style={{ background: "rgba(47,94,148,0.10)", border: "1px solid rgba(47,94,148,0.25)", color: "#2F5E94" }}>
              {viewAll} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* ── Desktop: hub & spoke ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex justify-center"
          onMouseLeave={() => setActive(null)}
        >
          <div className="relative" style={{ width: BOX, height: BOX }}>
            {/* Connector lines */}
            <svg className="absolute inset-0" width={BOX} height={BOX} viewBox={`0 0 ${BOX} ${BOX}`}>
              {shown.map((_, i) => {
                const p = nodePos(i, n);
                const on = active === i;
                return (
                  <line key={i} x1={C} y1={C} x2={p.x} y2={p.y}
                    stroke={on ? "#EA6E14" : "rgba(47,94,148,0.28)"}
                    strokeWidth={on ? 2.4 : 1.4}
                    strokeDasharray="4 7" strokeLinecap="round"
                    style={{ animation: "flow-dash 0.7s linear infinite", transition: "stroke 0.3s, stroke-width 0.3s" }} />
                );
              })}
            </svg>

            {/* Orbit ring */}
            <div className="absolute rounded-full pointer-events-none"
              style={{ inset: C - R, border: "1px dashed rgba(47,94,148,0.16)" }} />

            {/* Center hub / info */}
            <div className="absolute rounded-full flex items-center justify-center text-center overflow-hidden"
              style={{
                left: C - 132, top: C - 132, width: 264, height: 264,
                background: "var(--card-bg)",
                border: "1px solid rgba(47,94,148,0.18)",
                boxShadow: "0 20px 50px rgba(36,76,119,0.16), 0 0 0 8px rgba(47,94,148,0.04)",
                zIndex: 20,
              }}>
              <AnimatePresence mode="wait">
                {act ? (
                  <motion.div key={act.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }} className="px-7 flex flex-col items-center">
                    <span className="font-mono text-[10px] font-bold tracking-widest mb-2" style={{ color: "#EA6E14" }}>
                      LAB · {String((active ?? 0) + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display font-bold leading-snug mb-2 line-clamp-3 first-letter:uppercase"
                      style={{ fontSize: 16, color: "#1E293B" }}>
                      {act.name}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#2F5E94" }}>
                      {viewDetail} <ArrowRight size={13} />
                    </span>
                  </motion.div>
                ) : (
                  <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }} className="flex flex-col items-center">
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                      style={{ filter: "drop-shadow(0 0 16px rgba(47,94,148,0.4))" }}>
                      <Image src="/logo-icon.png" alt="ICHAB" width={86} height={86} className="object-contain" priority />
                    </motion.div>
                    <span className="font-display font-bold tracking-[0.2em] mt-2" style={{ fontSize: 20, color: "#1E293B" }}>ICHAB</span>
                    <span className="text-[10px] uppercase tracking-[0.14em] mt-1" style={{ color: "#94A3B8" }}>
                      {EYEBROW[locale] ?? EYEBROW.uz}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Nodes */}
            {shown.map((div, i) => {
              const p = nodePos(i, n);
              const Icon = PLACEHOLDER_ICONS[i % PLACEHOLDER_ICONS.length];
              const on = active === i;
              return (
                <Link
                  key={div.id}
                  href={`/${locale}/divisions/${div.slug}`}
                  onMouseEnter={() => setActive(i)}
                  className="absolute rounded-full overflow-hidden block"
                  style={{
                    left: p.x - NODE / 2, top: p.y - NODE / 2, width: NODE, height: NODE, zIndex: 10,
                    boxShadow: on
                      ? "0 0 0 3px #EA6E14, 0 14px 30px rgba(234,110,20,0.30)"
                      : "0 0 0 2px rgba(255,255,255,0.9), 0 8px 20px rgba(36,76,119,0.18)",
                    transform: on ? "scale(1.12)" : "scale(1)",
                    transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s",
                  }}
                >
                  <NodeMedia div={div} Icon={Icon} />
                  <span className="absolute inset-0 pointer-events-none transition-colors duration-300"
                    style={{ background: on ? "rgba(234,110,20,0.0)" : "rgba(15,23,42,0.18)" }} />
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: "rgba(255,255,255,0.92)", color: "#2F5E94" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* ── Mobile / tablet: clean stacked cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-5 mt-4">
          {shown.map((div, i) => {
            const Icon = PLACEHOLDER_ICONS[i % PLACEHOLDER_ICONS.length];
            return (
              <Link key={div.id} href={`/${locale}/divisions/${div.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ background: "var(--card-bg)", border: "1px solid var(--glass-border)", boxShadow: "var(--card-shadow)" }}>
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  {div.cover_image ? (
                    <Image src={mediaUrl(div.cover_image)} alt={div.name} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" priority={i < 2} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#3D72AD,#244C77)" }}>
                      <Icon size={44} color="rgba(255,255,255,0.85)" strokeWidth={1.3} />
                    </div>
                  )}
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
