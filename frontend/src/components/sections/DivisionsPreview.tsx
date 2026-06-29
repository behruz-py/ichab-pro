"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
const COLORS = ["59,130,246", "139,92,246", "16,185,129", "245,158,11", "236,72,153", "6,182,212"];

// ── Radial geometry (desktop) ───────────────────────────────────────────────
const STAGE = 600;
const C     = STAGE / 2;
const HUB_R = 112;
const ORBIT = 224;
const NR    = 50;                 // node radius
const ang   = (i: number, n: number) => (-90 + (360 / n) * i) * (Math.PI / 180);
const node  = (i: number, n: number) => ({ x: C + ORBIT * Math.cos(ang(i, n)), y: C + ORBIT * Math.sin(ang(i, n)) });

/** Circular avatar: cover image with an onError fallback to a branded color + icon. */
function NodeAvatar({ div, Icon, c }: { div: Division; Icon: LucideIcon; c: string }) {
  const [ok, setOk] = useState(true);
  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, rgba(${c},0.95) 0%, rgba(${c},0.5) 100%)` }}>
        <Icon size={32} color="rgba(255,255,255,0.92)" strokeWidth={1.4} />
      </div>
      {div.cover_image && ok && (
        <Image src={mediaUrl(div.cover_image)} alt="" fill sizes="110px"
          className="object-cover" onError={() => setOk(false)} />
      )}
    </>
  );
}

export function DivisionsPreview({ divisions, locale, title, subtitle, viewAll, viewDetail }: Props) {
  const shown = divisions.slice(0, 6);
  const [active, setActive] = useState<number | null>(null);
  if (!shown.length) return null;

  const n   = shown.length;
  const act = active !== null ? shown[active] : null;
  const lab = LAB[locale] ?? LAB.uz;

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(var(--accent-rgb),0.22) 50%,transparent)" }} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(var(--accent-rgb),0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-5">
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

        {/* ── Desktop: radial hub & spoke ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex justify-center"
          onMouseLeave={() => setActive(null)}
        >
          <div className="relative" style={{ width: STAGE, height: STAGE }}>
            {/* Connectors + rings */}
            <svg className="absolute inset-0 pointer-events-none" width={STAGE} height={STAGE} viewBox={`0 0 ${STAGE} ${STAGE}`}>
              <circle cx={C} cy={C} r={ORBIT} fill="none" stroke="rgba(var(--accent-rgb),0.12)" strokeWidth="1" strokeDasharray="2 7" />
              {shown.map((_, i) => {
                const on = active === i;
                const c  = COLORS[i % COLORS.length];
                const a  = ang(i, n);
                const sx = C + (HUB_R + 4) * Math.cos(a), sy = C + (HUB_R + 4) * Math.sin(a);
                const ex = C + (ORBIT - NR - 2) * Math.cos(a), ey = C + (ORBIT - NR - 2) * Math.sin(a);
                return (
                  <line key={i} x1={sx} y1={sy} x2={ex} y2={ey}
                    stroke={on ? `rgb(${c})` : "rgba(var(--accent-rgb),0.28)"}
                    strokeWidth={on ? 2.6 : 1.4} strokeDasharray="4 7" strokeLinecap="round"
                    style={{ animation: "flow-dash 0.8s linear infinite", transition: "stroke 0.3s, stroke-width 0.3s" }} />
                );
              })}
              <circle cx={C} cy={C} r={HUB_R + 16} fill="none" stroke="rgba(var(--accent-rgb),0.16)" strokeWidth="9"
                strokeDasharray="6 14" strokeLinecap="round" style={{ animation: "flow-dash 1.1s linear infinite" }} />
            </svg>

            {/* Nodes */}
            {shown.map((div, i) => {
              const p    = node(i, n);
              const Icon = ICONS[i % ICONS.length];
              const c    = COLORS[i % COLORS.length];
              const on   = active === i;
              return (
                <Link key={div.id} href={`/${locale}/divisions/${div.slug}`} title={div.name}
                  onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}
                  className="absolute block rounded-full overflow-hidden"
                  style={{
                    left: p.x - NR, top: p.y - NR, width: NR * 2, height: NR * 2, zIndex: 10,
                    border: `2px solid rgba(${c},${on ? 0.95 : 0.6})`,
                    boxShadow: on
                      ? `0 0 0 4px rgba(${c},0.18), 0 16px 36px rgba(${c},0.36)`
                      : "0 10px 24px rgba(2,12,30,0.35)",
                    transform: on ? "scale(1.12)" : "scale(1)",
                    transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s, border-color 0.3s",
                  }}>
                  <NodeAvatar div={div} Icon={Icon} c={c} />
                  <span className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(2,10,26,0.45), transparent 62%)" }} />
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded pointer-events-none"
                    style={{ background: "rgba(255,255,255,0.92)", color: `rgb(${c})` }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>
              );
            })}

            {/* Center hub */}
            <div className="absolute flex items-center justify-center text-center rounded-full"
              style={{
                left: C - HUB_R, top: C - HUB_R, width: HUB_R * 2, height: HUB_R * 2, zIndex: 20,
                background: "radial-gradient(circle at 50% 36%, var(--surface-elevated) 0%, var(--surface-card) 80%)",
                border: "1px solid rgba(var(--accent-rgb),0.18)",
                boxShadow: "0 22px 50px rgba(2,12,30,0.40), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 0 8px rgba(var(--accent-rgb),0.06)",
              }}>
              <AnimatePresence mode="wait">
                {act ? (
                  <motion.div key={act.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }} className="px-7 flex flex-col items-center">
                    <span className="font-mono text-[10px] font-bold tracking-widest mb-2" style={{ color: `rgb(${COLORS[(active ?? 0) % COLORS.length]})` }}>
                      {lab} · {String((active ?? 0) + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display font-bold leading-snug mb-3 line-clamp-4 first-letter:uppercase" style={{ fontSize: 13.5, color: "var(--content)" }}>
                      {act.name}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold" style={{ color: `rgb(${COLORS[(active ?? 0) % COLORS.length]})` }}>
                      {viewDetail} <ArrowRight size={12} />
                    </span>
                  </motion.div>
                ) : (
                  <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
                    className="flex flex-col items-center">
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                      style={{ filter: "drop-shadow(0 5px 18px rgba(var(--accent-rgb),0.4))" }}>
                      <Image src="/logo-icon.png" alt="ICHAB" width={72} height={72} className="object-contain" priority />
                    </motion.div>
                    <span className="font-display font-bold tracking-[0.2em] mt-2" style={{ fontSize: 18, color: "var(--content)" }}>ICHAB</span>
                    <span className="text-[9px] uppercase tracking-[0.14em] mt-1" style={{ color: "var(--content-muted)" }}>
                      {EYEBROW[locale] ?? EYEBROW.uz}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── Mobile / tablet: clean list ── */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}
          className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {shown.map((div, i) => {
            const Icon = ICONS[i % ICONS.length];
            const c    = COLORS[i % COLORS.length];
            return (
              <motion.div key={div.id} variants={fadeUp}>
                <Link href={`/${locale}/divisions/${div.slug}`}
                  className="flex items-center gap-4 p-3 rounded-2xl transition-transform duration-200 active:scale-[0.98]"
                  style={{ background: "var(--card-bg)", border: `1px solid rgba(${c},0.20)`, boxShadow: "var(--card-shadow)" }}>
                  <div className="relative rounded-xl overflow-hidden flex-shrink-0" style={{ width: 64, height: 64, border: `1px solid rgba(${c},0.3)` }}>
                    <NodeAvatar div={div} Icon={Icon} c={c} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[10px] font-bold" style={{ color: `rgb(${c})` }}>
                      {lab} · {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display font-bold text-sm leading-snug line-clamp-2 first-letter:uppercase text-content">{div.name}</h3>
                  </div>
                  <ArrowRight size={16} style={{ color: `rgb(${c})` }} className="flex-shrink-0" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
