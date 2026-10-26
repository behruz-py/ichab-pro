"use client";

import { useRef } from "react";
import { motion, useInView, useScroll } from "framer-motion";
import { EASE, PALETTE } from "./copy";
import { SectionLabel } from "@/components/editorial/SectionLabel";

interface Block { lead: string; items: string[] }

/** "Lead: item; item; item." paragraphs become a lead line plus a list. A
 * paragraph without that shape is kept as plain prose. */
export function parseBlocks(body: string): Block[] {
  return body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => {
    const colon = p.indexOf(":");
    if (colon < 0) return { lead: p, items: [] };
    const items = p.slice(colon + 1).split(";").map((s) => s.trim().replace(/[.;]\s*$/, "")).filter(Boolean);
    return items.length > 1 ? { lead: p.slice(0, colon).trim(), items } : { lead: p, items: [] };
  });
}

function GoalRow({ n, text, rgb }: { n: number; text: string; rgb: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const num = String(n).padStart(2, "0");
  const numStyle = { fontSize: "clamp(40px,4.4vw,64px)", lineHeight: 1 };
  return (
    <motion.li ref={ref} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="grid grid-cols-[auto,1fr] gap-5 sm:gap-8 py-7 sm:py-8" style={{ borderBottom: "1px solid var(--border)" }}>
      {/* Outline numeral that floods with color from the bottom once in view */}
      <span className="relative inline-block font-display font-bold tabular-nums select-none" style={numStyle} aria-hidden>
        <span style={{ WebkitTextStroke: `1.5px rgba(${rgb},0.55)`, WebkitTextFillColor: "transparent", color: "transparent" }}>{num}</span>
        <motion.span className="absolute inset-0"
          initial={{ clipPath: "inset(100% 0 0 0)" }} animate={inView ? { clipPath: "inset(0% 0 0 0)" } : {}}
          transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
          style={{ color: `rgb(${rgb})` }}>{num}</motion.span>
      </span>
      <p className="self-center first-letter:uppercase leading-relaxed" style={{ fontSize: "clamp(16px,1.35vw,20px)", color: "var(--content)" }}>{text}</p>
    </motion.li>
  );
}

export function GoalsSplit({ index, label, title, subtitle, body }: { index: number; label: string; title?: string; subtitle?: string; body: string }) {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.7", "end 0.6"] });
  const blocks = parseBlocks(body);

  return (
    <section className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionLabel index={index} label={label} />
            {title && (
              <h2 className="font-display font-bold leading-[1.05] tracking-[-0.02em]" style={{ fontSize: "clamp(34px,4.2vw,64px)", color: "var(--content)" }}>{title}</h2>
            )}
            {subtitle && <p className="mt-5 max-w-md leading-relaxed" style={{ fontSize: 17, color: "var(--content-secondary)" }}>{subtitle}</p>}
            <div className="hidden lg:block relative mt-12 w-px h-40" style={{ background: "var(--border)" }}>
              <motion.div className="absolute inset-0 origin-top" style={{ scaleY: scrollYProgress, background: "var(--hero-accent-gradient)" }} />
            </div>
          </div>
        </div>

        <div ref={listRef} className="lg:col-span-7 space-y-16">
          {blocks.map((b, bi) => (
            <div key={bi}>
              <p className="pl-4 mb-2 text-sm sm:text-[15px] leading-relaxed font-medium"
                style={{ borderLeft: `2px solid rgb(${PALETTE[(bi * 3) % PALETTE.length]})`, color: "var(--content-secondary)" }}>
                {b.lead}
              </p>
              {b.items.length > 0 && (
                <ol>
                  {b.items.map((it, i) => <GoalRow key={i} n={i + 1} text={it} rgb={PALETTE[(bi * 3 + i) % PALETTE.length]} />)}
                </ol>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
