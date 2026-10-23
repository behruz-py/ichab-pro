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

const EYEBROW: Record<string, string> = { uz: "Laboratoriyalar", ru: "Лаборатории", en: "Laboratories" };
const LAB: Record<string, string> = { uz: "Laboratoriya", ru: "Лаборатория", en: "Laboratory" };
const ICONS: LucideIcon[] = [FlaskConical, Cpu, Gauge, Activity, Cog, Zap];

// Vibrant neon hues (rgb triples) — cyan, purple, green, amber, pink, blue
const NEON = ["0,229,255", "181,84,255", "0,235,140", "255,170,40", "255,77,141", "56,189,248"];

// ── Stage geometry (desktop) — 3 cards left, hub center, 3 cards right ───────
// Official division names run 50–110 characters (real org-chart titles), so
// cards are sized to wrap the longest one onto 3 lines rather than clip it.
const W = 1292, H = 600;
const HUBX = 646, HUBY = 300, HUB_R = 78;
const CW = 480, CH = 130;
const LEFT_X = 18, RIGHT_X = W - 18 - CW;        // 18 / 794
const ROWS_Y = [114, 300, 486];                  // top / middle / bottom centers
// i → which side + row (alternating: L,R,L,R,L,R top→bottom)
const LAYOUT = [
  { side: "left",  row: 0 }, { side: "right", row: 0 },
  { side: "left",  row: 1 }, { side: "right", row: 1 },
  { side: "left",  row: 2 }, { side: "right", row: 2 },
] as const;

function cardRect(i: number) {
  const { side, row } = LAYOUT[i];
  const x = side === "left" ? LEFT_X : RIGHT_X;
  const yc = ROWS_Y[row];
  return { x, y: yc - CH / 2, yc, side };
}
// connector: from hub edge to the card edge that faces the hub
// Rounded so the SSR-computed and hydration-computed trig results always
// serialize to the exact same string — Math.sin/cos can differ in the last
// bit between Node's V8 and the browser's, which React treats as a mismatch.
const round = (n: number) => Math.round(n * 1000) / 1000;

function connector(i: number) {
  const { x, yc, side } = cardRect(i);
  const tx = side === "left" ? x + CW : x;       // inner edge of card
  const ty = yc;
  const a = Math.atan2(ty - HUBY, tx - HUBX);
  return { sx: round(HUBX + HUB_R * Math.cos(a)), sy: round(HUBY + HUB_R * Math.sin(a)), tx, ty };
}

/** Circular avatar: cover image with an onError fallback to a neon color + icon. */
function Avatar({ div, Icon, c, size }: { div: Division; Icon: LucideIcon; c: string; size: number }) {
  const [ok, setOk] = useState(true);
  return (
    <div className="relative rounded-full overflow-hidden flex-shrink-0"
      style={{ width: size, height: size, border: `2px solid rgb(${c})`, boxShadow: `0 0 14px rgba(${c},0.55)` }}>
      <div className="absolute inset-0 flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, rgba(${c},0.95) 0%, rgba(${c},0.5) 100%)` }}>
        <Icon size={size * 0.42} color="#fff" strokeWidth={1.5} />
      </div>
      {div.cover_image && ok && (
        <Image src={mediaUrl(div.cover_image)} alt="" fill sizes="64px" className="object-cover" onError={() => setOk(false)} />
      )}
    </div>
  );
}

export function DivisionsPreview({ divisions, locale, title, subtitle, viewAll, viewDetail }: Props) {
  const shown = divisions.slice(0, 6);
  const [active, setActive] = useState<number | null>(null);
  if (!shown.length) return null;
  const lab = LAB[locale] ?? LAB.uz;

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(var(--accent-rgb),0.22) 50%,transparent)" }} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[520px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(var(--accent-rgb),0.10) 0%, transparent 70%)", filter: "blur(50px)" }} />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-5">
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

        {/* ── Desktop: neon mind-map ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block relative mx-auto"
          style={{ width: W, height: H }}
          onMouseLeave={() => setActive(null)}
        >
          {/* Connector lines (neon, glowing) */}
          <svg className="absolute inset-0 pointer-events-none" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            {shown.map((_, i) => {
              const { sx, sy, tx, ty } = connector(i);
              const c = NEON[i % NEON.length];
              const on = active === i;
              return (
                <line key={i} x1={sx} y1={sy} x2={tx} y2={ty}
                  stroke={`rgb(${c})`} strokeWidth={on ? 3 : 1.8} strokeLinecap="round"
                  strokeDasharray="5 7" opacity={on ? 1 : 0.7}
                  style={{
                    animation: "flow-dash 0.8s linear infinite",
                    filter: `drop-shadow(0 0 ${on ? 6 : 3}px rgba(${c},0.9))`,
                    transition: "stroke-width 0.3s, opacity 0.3s, filter 0.3s",
                  }} />
              );
            })}
            {/* joint dots at the hub */}
            {shown.map((_, i) => {
              const { sx, sy } = connector(i);
              const c = NEON[i % NEON.length];
              return <circle key={`d${i}`} cx={sx} cy={sy} r={3.5} fill={`rgb(${c})`} style={{ filter: `drop-shadow(0 0 4px rgb(${c}))` }} />;
            })}
          </svg>

          {/* Cards */}
          {shown.map((div, i) => {
            const { x, y, side } = cardRect(i);
            const c = NEON[i % NEON.length];
            const Icon = ICONS[i % ICONS.length];
            const on = active === i;
            return (
              <Link key={div.id} href={`/${locale}/divisions/${div.slug}`} title={div.name}
                onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}
                className="absolute flex items-center gap-3 rounded-[28px] px-3.5"
                style={{
                  left: x, top: y, width: CW, height: CH, zIndex: 10,
                  flexDirection: side === "right" ? "row" : "row",
                  background: "var(--card-bg)",
                  border: `1.5px solid rgba(${c},${on ? 1 : 0.65})`,
                  boxShadow: on
                    ? `0 0 22px rgba(${c},0.65), 0 0 46px rgba(${c},0.30), inset 0 0 18px rgba(${c},0.12)`
                    : `0 0 14px rgba(${c},0.30), inset 0 0 12px rgba(${c},0.06)`,
                  transform: on ? "scale(1.04)" : "scale(1)",
                  transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s, border-color 0.3s",
                }}>
                <Avatar div={div} Icon={Icon} c={c} size={62} />
                <div className="min-w-0 flex-1">
                  <span className="block font-mono text-[12px] font-bold tracking-widest mb-0.5" style={{ color: `rgb(${c})` }}>
                    {lab} · {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display font-bold text-[14px] leading-snug line-clamp-3 first-letter:uppercase text-content">
                    {div.name}
                  </h3>
                </div>
              </Link>
            );
          })}

          {/* Center hub */}
          <div className="absolute flex flex-col items-center justify-center rounded-full"
            style={{
              left: HUBX - HUB_R, top: HUBY - HUB_R, width: HUB_R * 2, height: HUB_R * 2, zIndex: 20,
              background: "radial-gradient(circle at 50% 36%, var(--surface-elevated) 0%, var(--surface-card) 82%)",
              border: "1.5px solid rgba(var(--accent-rgb),0.55)",
              boxShadow: "0 0 26px rgba(var(--accent-rgb),0.45), 0 0 60px rgba(var(--accent-rgb),0.20), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}>
            <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ filter: "drop-shadow(0 4px 16px rgba(var(--accent-rgb),0.5))" }}>
              <Image src="/logo-icon.png" alt="ICHAB" width={64} height={64} className="object-contain" priority />
            </motion.div>
            <span className="font-display font-bold tracking-[0.2em] mt-1.5" style={{ fontSize: 17, color: "var(--content)" }}>ICHAB</span>
          </div>
        </motion.div>

        {/* ── Mobile / tablet: list ── */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}
          className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {shown.map((div, i) => {
            const Icon = ICONS[i % ICONS.length];
            const c = NEON[i % NEON.length];
            return (
              <motion.div key={div.id} variants={fadeUp}>
                <Link href={`/${locale}/divisions/${div.slug}`} title={div.name}
                  className="flex items-center gap-4 p-3 rounded-2xl transition-transform duration-200 active:scale-[0.98]"
                  style={{ background: "var(--card-bg)", border: `1.5px solid rgba(${c},0.55)`, boxShadow: `0 0 14px rgba(${c},0.25)` }}>
                  <Avatar div={div} Icon={Icon} c={c} size={60} />
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[12px] font-bold" style={{ color: `rgb(${c})` }}>
                      {lab} · {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display font-bold text-sm leading-snug first-letter:uppercase text-content">{div.name}</h3>
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
