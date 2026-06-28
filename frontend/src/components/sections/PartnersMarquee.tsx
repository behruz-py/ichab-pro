"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Partner } from "@/types/api";
import { mediaUrl } from "@/lib/utils";
import { fadeUp, VIEWPORT } from "@/lib/motion";

// ── Card dimensions ─────────────────────────────────────────────────────────
const CARD_W  = 252;
const CARD_H  = 116;
const GAP     = 30;
const STRIDE  = CARD_W + GAP;  // 282 px
const SPEED   = 0.50;

// ── Coverflow math ──────────────────────────────────────────────────────────
const MAX_DIST    = STRIDE * 3.2;   // 902 px — full fade distance
const ACTIVE_DIST = STRIDE * 0.32;  // ~90 px — "spotlight" threshold

// Non-linear scale: steep drop from center (1.06 → 0.83 at 1 card away), then gradual
function cfScale  (t: number) { return 1.06 - Math.pow(t, 0.65) * 0.50; }
function cfOpacity(t: number) { return 1.00 - t * 0.80; }
function cfBlur   (t: number) { return t * t * t * 10; }

const SHADOW_ACTIVE = [
  "0 0 0 2.5px rgba(var(--accent-rgb),0.72)",
  "0 0 28px rgba(var(--accent-rgb),0.32)",
  "0 8px 40px rgba(var(--accent-2-rgb),0.14)",
].join(", ");

const SHADOW_NORMAL = "0 4px 24px rgba(var(--accent-2-rgb),0.10), 0 1px 4px rgba(var(--accent-2-rgb),0.06)";

interface Props {
  partners: Partner[];
  title: string;
  subtitle: string;
}

export function PartnersMarquee({ partners, title, subtitle }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);
  const offsetRef    = useRef(0);
  const rafRef       = useRef<number>(0);
  const pausedRef    = useRef(false);

  const count   = partners.length;
  const loopLen = count * STRIDE;
  const REPEAT  = Math.max(40, Math.ceil(6000 / STRIDE));
  const items   = Array.from({ length: REPEAT }, (_, i) => partners[i % count]);

  useEffect(() => {
    const container = containerRef.current;
    const track     = trackRef.current;
    if (!container || !track || count === 0) return;

    const containerEl: HTMLDivElement = container;
    const trackEl: HTMLDivElement     = track;

    offsetRef.current = Math.floor(REPEAT / 2) * STRIDE;

    function tick() {
      if (!pausedRef.current) {
        offsetRef.current += SPEED;
        if (offsetRef.current > loopLen * 2000) offsetRef.current -= loopLen * 1000;
      }

      const rect  = containerEl.getBoundingClientRect();
      const cw    = rect.width;
      const cx    = cw / 2;
      const trackX = cx - CARD_W / 2 - offsetRef.current;

      trackEl.style.transform = `translateX(${trackX.toFixed(2)}px)`;

      const cards = trackEl.children;
      for (let i = 0; i < cards.length; i++) {
        const cardScreenCX = i * STRIDE + CARD_W / 2 + trackX;
        const dist         = Math.abs(cardScreenCX - cx);
        const t            = Math.min(dist / MAX_DIST, 1);
        const isActive     = dist < ACTIVE_DIST;

        const scale   = cfScale(t);
        const opacity = cfOpacity(t);
        const blur    = cfBlur(t);

        const el = cards[i] as HTMLElement;
        el.style.transform  = `scale(${scale.toFixed(3)})`;
        el.style.opacity    = opacity.toFixed(3);
        el.style.filter     = blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : "";
        el.style.zIndex     = String(Math.max(0, Math.round((1 - t) * 100)));
        el.style.boxShadow  = isActive ? SHADOW_ACTIVE : SHADOW_NORMAL;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    const onEnter = () => { pausedRef.current = true; };
    const onLeave = () => { pausedRef.current = false; };
    containerEl.addEventListener("mouseenter", onEnter);
    containerEl.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      containerEl.removeEventListener("mouseenter", onEnter);
      containerEl.removeEventListener("mouseleave", onLeave);
    };
  }, [count, loopLen, REPEAT]);

  if (count === 0) return null;

  return (
    <section className="py-16">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.20em] mb-3"
            style={{ color: "var(--accent)" }}
          >
            Hamkorlar
          </span>
          <h2
            className="font-display font-bold text-content"
            style={{ fontSize: "clamp(26px, 3vw, 40px)" }}
          >
            {title}
          </h2>
          <p className="mt-3 max-w-xl mx-auto" style={{ color: "var(--content-secondary)" }}>
            {subtitle}
          </p>
        </motion.div>
      </div>

      {/* ── Coverflow stage ─────────────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: `${CARD_H + 52}px` }}
      >
        {/* Edge fades */}
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-56 z-20"
          style={{ background: "linear-gradient(to right, rgba(var(--surface-rgb),1) 10%, transparent 100%)" }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-56 z-20"
          style={{ background: "linear-gradient(to left, rgba(var(--surface-rgb),1) 10%, transparent 100%)" }}
        />

        {/* Spotlight glow line under center card */}
        <div
          className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 z-10"
          style={{
            width:        `${CARD_W + 60}px`,
            height:       "6px",
            background:   "radial-gradient(ellipse, rgba(var(--accent-rgb),0.55) 0%, transparent 75%)",
            borderRadius: "3px",
            filter:       "blur(2px)",
          }}
        />

        {/* Track */}
        <div ref={containerRef} className="absolute inset-0">
          <div
            ref={trackRef}
            className="absolute flex items-center"
            style={{ top: "18px", left: 0, gap: `${GAP}px`, willChange: "transform" }}
          >
            {items.map((partner, i) => (
              <div
                key={i}
                style={{
                  width:           `${CARD_W}px`,
                  height:          `${CARD_H}px`,
                  flexShrink:      0,
                  background:      "#FFFFFF",
                  borderRadius:    "16px",
                  display:         "flex",
                  alignItems:      "center",
                  justifyContent:  "center",
                  padding:         "10px 14px",
                  willChange:      "transform, opacity, filter, box-shadow",
                  transformOrigin: "center center",
                  overflow:        "hidden",
                }}
              >
                {partner.logo ? (
                  <Image
                    src={mediaUrl(partner.logo)}
                    alt={partner.name}
                    width={224}
                    height={96}
                    className="object-contain"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    draggable={false}
                  />
                ) : (
                  <span style={{ color: "var(--content)", fontWeight: 700, fontSize: "15px", textAlign: "center" }}>
                    {partner.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Trust indicator ─────────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="mt-8 flex items-center justify-center gap-5"
      >
        <div style={{ height: "1px", width: "60px", background: "rgba(var(--accent-rgb),0.20)" }} />
        <p style={{ color: "var(--content-muted)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em" }}>
          <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: "14px" }}>{count}</span>
          {" "}ta ishonchli hamkor kompaniya
        </p>
        <div style={{ height: "1px", width: "60px", background: "rgba(var(--accent-rgb),0.20)" }} />
      </motion.div>

    </section>
  );
}
