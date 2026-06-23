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

const BOX = 720;          // diagram canvas
const C = BOX / 2;        // center
const R = 272;            // node orbit radius
const NODE_W = 200;       // node width (5:3 soft-oval rect)
const NODE_H = 120;
const NODE_RAD = 34;
const HUB_W = 248;        // center OVAL width
const HUB_H = 188;        // center OVAL height
const COG_RX = HUB_W / 2 + 13;
const COG_RY = HUB_H / 2 + 13;

const rad = (i: number, n: number) => (-90 + (360 / n) * i) * (Math.PI / 180);
const nodePos = (i: number, n: number) => ({ x: C + R * Math.cos(rad(i, n)), y: C + R * Math.sin(rad(i, n)) });
// start the connector at the oval rim so it doesn't run under the hub
function hubEdge(i: number, n: number) {
  const a = rad(i, n), rx = COG_RX + 9, ry = COG_RY + 9;
  const er = (rx * ry) / Math.sqrt((ry * Math.cos(a)) ** 2 + (rx * Math.sin(a)) ** 2);
  return { x: C + er * Math.cos(a), y: C + er * Math.sin(a) };
}

function NodeMedia({ div, Icon }: { div: Division; Icon: LucideIcon }) {
  return div.cover_image ? (
    <Image src={mediaUrl(div.cover_image)} alt={div.name} fill className="object-cover" sizes="200px" />
  ) : (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#3D72AD,#244C77)" }}>
      <Icon size={40} strokeWidth={1.3} color="rgba(255,255,255,0.85)" />
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
    <section className="relative py-16 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(47,94,148,0.22) 50%,transparent)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-2 gap-5">
          <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: "#2F5E94" }}>
              {EYEBROW[locale] ?? EYEBROW.uz}
            </span>
            <h2 className="font-display font-bold text-content leading-tight" style={{ fontSize: "clamp(28px,3.5vw,44px)" }}>{title}</h2>
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
              inset: 90,
              background: "radial-gradient(circle at 50% 50%, rgba(47,94,148,0.10) 0%, rgba(234,110,20,0.05) 45%, transparent 70%)",
              filter: "blur(8px)",
            }} />

            {/* Orbit ring through node centers */}
            <div className="absolute rounded-full pointer-events-none" style={{ inset: C - R, border: "1px dashed rgba(47,94,148,0.13)" }} />

            {/* Connectors + oval cog mechanism */}
            <svg className="absolute inset-0" width={BOX} height={BOX} viewBox={`0 0 ${BOX} ${BOX}`}>
              {/* connector lines */}
              {shown.map((_, i) => {
                const s = hubEdge(i, n), p = nodePos(i, n);
                const on = active === i;
                return (
                  <line key={i} x1={s.x} y1={s.y} x2={p.x} y2={p.y}
                    stroke={on ? "#EA6E14" : "rgba(47,94,148,0.30)"} strokeWidth={on ? 2.4 : 1.4}
                    strokeDasharray="3 8" strokeLinecap="round"
                    style={{ animation: "flow-dash 0.8s linear infinite", transition: "stroke 0.3s, stroke-width 0.3s" }} />
                );
              })}
              {/* oval cog — flowing dashes (no wobble) */}
              <ellipse cx={C} cy={C} rx={COG_RX} ry={COG_RY} fill="none" stroke="rgba(47,94,148,0.18)" strokeWidth="12"
                strokeDasharray="8 16" strokeLinecap="round" style={{ animation: "flow-dash 1.1s linear infinite" }} />
              <ellipse cx={C} cy={C} rx={COG_RX - 9} ry={COG_RY - 9} fill="none" stroke="rgba(234,110,20,0.16)" strokeWidth="6"
                strokeDasharray="8 16" strokeLinecap="round" style={{ animation: "flow-dash 1.1s linear infinite reverse" }} />
            </svg>

            {/* ── Center OVAL hub / info ── */}
            <div className="absolute flex items-center justify-center text-center overflow-hidden"
              style={{
                left: C - HUB_W / 2, top: C - HUB_H / 2, width: HUB_W, height: HUB_H, borderRadius: "50%",
                background: "radial-gradient(circle at 50% 36%, #FFFFFF 0%, #F2F6FB 78%)",
                border: "1px solid rgba(47,94,148,0.16)",
                boxShadow: "0 22px 50px rgba(36,76,119,0.16), inset 0 2px 4px rgba(255,255,255,0.9), 0 0 0 8px rgba(255,255,255,0.5)",
                zIndex: 20,
              }}>
              <AnimatePresence mode="wait">
                {act ? (
                  <motion.div key={act.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }} className="px-8 flex flex-col items-center">
                    <span className="font-mono text-[10px] font-bold tracking-widest mb-2" style={{ color: "#EA6E14" }}>
                      LAB · {String((active ?? 0) + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display font-bold leading-snug mb-2.5 line-clamp-3 first-letter:uppercase" style={{ fontSize: 15, color: "#1E293B" }}>
                      {act.name}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg"
                      style={{ background: "linear-gradient(135deg,#EE8418,#D2630E)", color: "#fff", boxShadow: "0 6px 16px rgba(208,98,16,0.28)" }}>
                      {viewDetail} <ArrowRight size={13} />
                    </span>
                  </motion.div>
                ) : (
                  <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
                    className="flex flex-col items-center">
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                      style={{ filter: "drop-shadow(0 5px 18px rgba(47,94,148,0.4))" }}>
                      <Image src="/logo-icon.png" alt="ICHAB" width={84} height={84} className="object-contain" priority />
                    </motion.div>
                    <span className="font-display font-bold tracking-[0.2em] mt-2" style={{ fontSize: 20, color: "#1E293B" }}>ICHAB</span>
                    <span className="text-[9px] uppercase tracking-[0.14em] mt-1" style={{ color: "#94A3B8" }}>
                      {EYEBROW[locale] ?? EYEBROW.uz}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Nodes ── */}
            {shown.map((div, i) => {
              const p = nodePos(i, n);
              const Icon = PLACEHOLDER_ICONS[i % PLACEHOLDER_ICONS.length];
              const on = active === i;
              return (
                <Link key={div.id} href={`/${locale}/divisions/${div.slug}`} onMouseEnter={() => setActive(i)}
                  className="absolute overflow-hidden block"
                  style={{
                    left: p.x - NODE_W / 2, top: p.y - NODE_H / 2, width: NODE_W, height: NODE_H, borderRadius: NODE_RAD, zIndex: 10,
                    boxShadow: on
                      ? "0 0 0 4px #EA6E14, 0 22px 46px rgba(234,110,20,0.32)"
                      : "0 0 0 3px rgba(255,255,255,0.95), 0 14px 32px rgba(36,76,119,0.20)",
                    transform: on ? "scale(1.07)" : "scale(1)",
                    transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s",
                  }}>
                  <NodeMedia div={div} Icon={Icon} />
                  <span className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                    style={{ background: "linear-gradient(to top, rgba(15,23,42,0.45) 0%, rgba(15,23,42,0.10) 45%, transparent 70%)", opacity: on ? 0.4 : 1 }} />
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{ background: "rgba(255,255,255,0.94)", color: "#2F5E94" }}>
                    LAB · {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>
              );
            })}
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
                  <h3 className="font-display font-bold text-base leading-snug mb-2 line-clamp-2 first-letter:uppercase" style={{ color: "#1E293B" }}>{div.name}</h3>
                  {div.short_description && (
                    <p className="text-sm leading-relaxed line-clamp-2 mb-4 flex-1" style={{ color: "#475569" }}>{div.short_description}</p>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold mt-auto" style={{ color: "#2F5E94" }}>{viewDetail} <ArrowRight size={14} /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
