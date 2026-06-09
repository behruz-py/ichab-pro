"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Partner } from "@/types/api";
import { mediaUrl } from "@/lib/utils";
import { fadeUp, VIEWPORT } from "@/lib/motion";

const CARD_W = 200;
const CARD_H = 96;
const GAP    = 28;
const STRIDE = CARD_W + GAP;
const SPEED  = 0.55; // px per frame at 60fps

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

  // Repeat enough for the track to always extend beyond the viewport on both sides
  const REPEAT = Math.max(30, Math.ceil(5000 / STRIDE));
  const items  = Array.from({ length: REPEAT }, (_, i) => partners[i % count]);

  useEffect(() => {
    const container = containerRef.current;
    const track     = trackRef.current;
    if (!container || !track || count === 0) return;

    // Start from middle of the repeated array so cards appear on both sides
    const mid = Math.floor(REPEAT / 2);
    offsetRef.current = mid * STRIDE;

    function tick() {
      if (!pausedRef.current) {
        offsetRef.current += SPEED;
        // Prevent float overflow over long sessions
        if (offsetRef.current > loopLen * 1000) {
          offsetRef.current -= loopLen * 500;
        }
      }

      const cw = container.offsetWidth;
      const cx = cw / 2;

      // translateX so that card[0] would be centered when offset=0
      // card[i] center = (cx - CARD_W/2 - offset) + i*STRIDE + CARD_W/2
      //                = cx + i*STRIDE - offset
      const trackX = cx - CARD_W / 2 - offsetRef.current;
      track.style.transform = `translateX(${trackX.toFixed(2)}px)`;

      // Coverflow: scale, opacity, blur, rotateY based on distance from center
      const cards = track.children;
      for (let i = 0; i < cards.length; i++) {
        const cardCX   = i * STRIDE + CARD_W / 2;   // card center relative to track origin
        const screenCX = cardCX + trackX;            // card center on screen
        const dist     = Math.abs(screenCX - cx);
        const maxD     = STRIDE * 2.6;
        const t        = Math.min(dist / maxD, 1);   // 0=center, 1=far

        const scale   = 1.0  - t * 0.42;
        const opacity = 1.0  - t * 0.78;
        const blur    = t * 12;
        const rotateY = (screenCX < cx ? 1 : -1) * t * 45; // tilt away from center
        const zIdx    = Math.round((1 - t) * 100);

        const el = cards[i] as HTMLElement;
        el.style.transform     = `scale(${scale.toFixed(3)}) perspective(600px) rotateY(${rotateY.toFixed(1)}deg)`;
        el.style.opacity       = opacity.toFixed(3);
        el.style.filter        = blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : "";
        el.style.zIndex        = String(Math.max(0, zIdx));
        el.style.transformOrigin = "center center";
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    const onEnter = () => { pausedRef.current = true; };
    const onLeave = () => { pausedRef.current = false; };
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [count, loopLen, REPEAT]);

  if (count === 0) return null;

  return (
    <section className="py-20 overflow-hidden">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.20em] mb-3"
            style={{ color: "#3B82F6" }}
          >
            Hamkorlar
          </span>
          <h2
            className="font-display font-bold text-content"
            style={{ fontSize: "clamp(26px, 3vw, 40px)" }}
          >
            {title}
          </h2>
          <p className="mt-3 max-w-xl mx-auto" style={{ color: "#7B93B8" }}>
            {subtitle}
          </p>
        </motion.div>
      </div>

      {/* Coverflow container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden cursor-default"
        style={{ height: `${CARD_H + 64}px` }}
      >
        {/* Left fade */}
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-48 z-30"
          style={{ background: "linear-gradient(to right, #050A17 0%, transparent 100%)" }}
        />
        {/* Right fade */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-48 z-30"
          style={{ background: "linear-gradient(to left, #050A17 0%, transparent 100%)" }}
        />

        {/* Track */}
        <div
          ref={trackRef}
          className="absolute flex items-center"
          style={{
            top: "32px",
            left: 0,
            gap: `${GAP}px`,
            willChange: "transform",
          }}
        >
          {items.map((partner, i) => (
            <div
              key={i}
              style={{
                width:           `${CARD_W}px`,
                height:          `${CARD_H}px`,
                flexShrink:      0,
                background:      "rgba(255, 255, 255, 0.97)",
                borderRadius:    "14px",
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                padding:         "0 22px",
                boxShadow:       "0 4px 28px rgba(0,0,0,0.40), 0 1px 4px rgba(0,0,0,0.20)",
                willChange:      "transform, opacity, filter",
                transformOrigin: "center center",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              {partner.logo ? (
                <Image
                  src={mediaUrl(partner.logo)}
                  alt={partner.name}
                  width={140}
                  height={56}
                  className="object-contain"
                  style={{ maxHeight: "56px", width: "auto", maxWidth: "140px" }}
                  draggable={false}
                />
              ) : (
                <span
                  style={{
                    color:      "#1e293b",
                    fontWeight: 700,
                    fontSize:   "15px",
                    textAlign:  "center",
                  }}
                >
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pause hint */}
      <p className="text-center mt-4 text-xs" style={{ color: "#344768" }}>
        Hover qiling — to&apos;xtatish uchun
      </p>
    </section>
  );
}
