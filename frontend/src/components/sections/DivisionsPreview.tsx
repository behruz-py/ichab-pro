"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, FlaskConical, Cpu, Gauge, Activity, Cog, Zap, CircuitBoard, Bot,
  type LucideIcon,
} from "lucide-react";
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

const BOX = 760;
const C = BOX / 2;
const R = 285;
const NODE_W = 236;
const NODE_H = 142;
const NODE_RAD = 36;
const HUB_W = 250;
const HUB_H = 190;
const COG_RX = HUB_W / 2 + 13;
const COG_RY = HUB_H / 2 + 13;

const rad = (i: number, n: number) => (-90 + (360 / n) * i) * (Math.PI / 180);
const nodePos = (i: number, n: number) => ({ x: C + R * Math.cos(rad(i, n)), y: C + R * Math.sin(rad(i, n)) });
function hubEdge(i: number, n: number) {
  const a = rad(i, n), rx = COG_RX + 9, ry = COG_RY + 9;
  const er = (rx * ry) / Math.sqrt((ry * Math.cos(a)) ** 2 + (rx * Math.sin(a)) ** 2);
  return { x: C + er * Math.cos(a), y: C + er * Math.sin(a) };
}

// Faint automation icons scattered in the background
const BG_ICONS: { Icon: LucideIcon; style: React.CSSProperties }[] = [
  { Icon: Cpu,          style: { top: "8%",  left: "4%",  width: 96 } },
  { Icon: Cog,          style: { top: "62%", left: "2%",  width: 120 } },
  { Icon: CircuitBoard, style: { top: "14%", right: "5%", width: 110 } },
  { Icon: Gauge,        style: { top: "70%", right: "4%", width: 92 } },
  { Icon: Bot,          style: { bottom: "4%", left: "44%", width: 88 } },
  { Icon: Activity,     style: { top: "2%",  left: "46%", width: 80 } },
];

function NodeMedia({ div, Icon }: { div: Division; Icon: LucideIcon }) {
  // Always paint a branded gradient + icon underneath, so a missing or
  // failed-to-load cover image degrades gracefully instead of exposing the
  // rotating border behind the (transparent) card.
  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center" style={{ background: "var(--accent-gradient)" }}>
        <Icon size={46} strokeWidth={1.3} color="rgba(255,255,255,0.85)" />
      </div>
      {div.cover_image && (
        <Image src={mediaUrl(div.cover_image)} alt={div.name} fill className="object-cover" sizes="236px" />
      )}
    </>
  );
}

export function DivisionsPreview({ divisions, locale, title, subtitle, viewAll, viewDetail }: Props) {
  const shown = divisions.slice(0, 6);
  const [active, setActive] = useState<number | null>(null);
  if (!shown.length) return null;

  const n = shown.length;
  const act = active !== null ? shown[active] : null;

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(var(--accent-rgb),0.22) 50%,transparent)" }} />

      {/* Faint automation background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute inset-0" style={{
          opacity: 0.03,
          backgroundImage: "radial-gradient(rgba(var(--accent-rgb),1) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }} />
        {BG_ICONS.map(({ Icon, style }, i) => (
          <Icon key={i} className="absolute" strokeWidth={1} style={{ color: "var(--accent)", opacity: 0.045, ...style }} />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-2 gap-5">
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

        {/* ── Desktop: oval gear hub & spoke ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex justify-center"
          onMouseLeave={() => setActive(null)}
        >
          <div className="relative" style={{ width: BOX, height: BOX }}>
            {/* Soft backdrop glow */}
            <div className="absolute rounded-full pointer-events-none" style={{
              inset: 110,
              background: "radial-gradient(circle at 50% 50%, rgba(var(--accent-rgb),0.10) 0%, rgba(var(--warm-glow),0.05) 45%, transparent 70%)",
              filter: "blur(8px)",
            }} />

            {/* Connectors + cog */}
            <svg className="absolute inset-0 pointer-events-none" width={BOX} height={BOX} viewBox={`0 0 ${BOX} ${BOX}`}>
              <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(var(--accent-rgb),0.12)" strokeWidth="1" strokeDasharray="2 8" />
              {shown.map((_, i) => {
                const s = hubEdge(i, n), p = nodePos(i, n);
                const on = active === i;
                return (
                  <line key={i} x1={s.x} y1={s.y} x2={p.x} y2={p.y}
                    stroke={on ? "var(--warm-solid)" : "rgba(var(--accent-rgb),0.30)"} strokeWidth={on ? 2.4 : 1.4}
                    strokeDasharray="3 8" strokeLinecap="round"
                    style={{ animation: "flow-dash 0.8s linear infinite", transition: "stroke 0.3s, stroke-width 0.3s" }} />
                );
              })}
              <ellipse cx={C} cy={C} rx={COG_RX} ry={COG_RY} fill="none" stroke="rgba(var(--accent-rgb),0.18)" strokeWidth="12"
                strokeDasharray="8 16" strokeLinecap="round" style={{ animation: "flow-dash 1.1s linear infinite" }} />
              <ellipse cx={C} cy={C} rx={COG_RX - 9} ry={COG_RY - 9} fill="none" stroke="rgba(var(--warm-glow),0.16)" strokeWidth="6"
                strokeDasharray="8 16" strokeLinecap="round" style={{ animation: "flow-dash 1.1s linear infinite reverse" }} />
            </svg>

            {/* Nodes — each with rotating AI gradient border */}
            {shown.map((div, i) => {
              const p = nodePos(i, n);
              const Icon = PLACEHOLDER_ICONS[i % PLACEHOLDER_ICONS.length];
              const on = active === i;
              return (
                <div key={div.id} className="ai-border absolute"
                  style={{
                    left: p.x - NODE_W / 2, top: p.y - NODE_H / 2, width: NODE_W, height: NODE_H, zIndex: 10,
                    boxShadow: on ? "0 24px 50px rgba(var(--warm-glow),0.28)" : "0 16px 36px rgba(var(--accent-2-rgb),0.20)",
                    transform: on ? "scale(1.05)" : "scale(1)",
                    transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s",
                  }}>
                  <Link href={`/${locale}/divisions/${div.slug}`} onMouseEnter={() => setActive(i)}
                    className="group relative block w-full h-full overflow-hidden" style={{ borderRadius: NODE_RAD }}>
                    <NodeMedia div={div} Icon={Icon} />
                    {/* shine sweep */}
                    <span className="absolute inset-y-0 -left-1/3 w-1/3 pointer-events-none skew-x-12 -translate-x-[120%] group-hover:translate-x-[420%] transition-transform duration-[850ms] ease-out"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)" }} />
                    <span className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                      style={{ background: "linear-gradient(to top, rgba(15,23,42,0.45) 0%, rgba(15,23,42,0.10) 45%, transparent 70%)", opacity: on ? 0.4 : 1 }} />
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold px-2 py-0.5 rounded"
                      style={{ background: "rgba(255,255,255,0.94)", color: "var(--accent)" }}>
                      Laboratoriya · {String(i + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </div>
              );
            })}

            {/* Center OVAL hub / info */}
            <div className="absolute flex items-center justify-center text-center overflow-hidden"
              style={{
                left: C - HUB_W / 2, top: C - HUB_H / 2, width: HUB_W, height: HUB_H, borderRadius: "50%",
                background: "radial-gradient(circle at 50% 36%, var(--surface-elevated) 0%, var(--surface-card) 78%)",
                border: "1px solid rgba(var(--accent-rgb),0.16)",
                boxShadow: "0 22px 50px rgba(var(--accent-2-rgb),0.16), inset 0 2px 4px rgba(255,255,255,0.5), 0 0 0 8px rgba(var(--accent-rgb),0.10)",
                zIndex: 20,
              }}>
              <AnimatePresence mode="wait">
                {act ? (
                  <motion.div key={act.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }} className="px-8 flex flex-col items-center">
                    <span className="font-mono text-[10px] font-bold tracking-widest mb-2" style={{ color: "var(--warm-solid)" }}>
                      Laboratoriya · {String((active ?? 0) + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display font-bold leading-snug mb-2.5 line-clamp-3 first-letter:uppercase" style={{ fontSize: 15, color: "var(--content)" }}>
                      {act.name}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg"
                      style={{ background: "var(--warm-btn)", color: "#fff", boxShadow: "0 6px 16px rgba(var(--warm-glow),0.28)" }}>
                      {viewDetail} <ArrowRight size={13} />
                    </span>
                  </motion.div>
                ) : (
                  <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
                    className="flex flex-col items-center">
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                      style={{ filter: "drop-shadow(0 5px 18px rgba(var(--accent-rgb),0.4))" }}>
                      <Image src="/logo-icon.png" alt="ICHAB" width={84} height={84} className="object-contain" priority />
                    </motion.div>
                    <span className="font-display font-bold tracking-[0.2em] mt-2" style={{ fontSize: 20, color: "var(--content)" }}>ICHAB</span>
                    <span className="text-[9px] uppercase tracking-[0.14em] mt-1" style={{ color: "var(--content-muted)" }}>
                      {EYEBROW[locale] ?? EYEBROW.uz}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── Mobile / tablet: stacked cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-5 mt-4">
          {shown.map((div, i) => {
            const Icon = PLACEHOLDER_ICONS[i % PLACEHOLDER_ICONS.length];
            return (
              <Link key={div.id} href={`/${locale}/divisions/${div.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ background: "var(--card-bg)", border: "1px solid var(--glass-border)", boxShadow: "var(--card-shadow)" }}>
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: "var(--accent-gradient)" }}>
                    <Icon size={44} color="rgba(255,255,255,0.85)" strokeWidth={1.3} />
                  </div>
                  {div.cover_image && (
                    <Image src={mediaUrl(div.cover_image)} alt={div.name} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" priority={i < 2} />
                  )}
                  <span className="absolute top-3 left-3 font-mono text-[11px] font-bold tracking-widest px-2.5 py-1 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(var(--accent-rgb),0.25)", color: "var(--accent)" }}>
                    Laboratoriya · {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-col flex-1 p-4">
                  <h3 className="font-display font-bold text-base leading-snug mb-2 line-clamp-2 first-letter:uppercase" style={{ color: "var(--content)" }}>{div.name}</h3>
                  {div.short_description && (
                    <p className="text-sm leading-relaxed line-clamp-2 mb-4 flex-1" style={{ color: "var(--content-secondary)" }}>{div.short_description}</p>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold mt-auto" style={{ color: "var(--accent)" }}>{viewDetail} <ArrowRight size={14} /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
