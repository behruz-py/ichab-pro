"use client";

import { useId } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award, ShieldCheck } from "lucide-react";
import type { Certificate } from "@/types/api";
import { EASE, T, tr } from "./copy";
import { SectionLabel } from "./SectionLabel";

const R = 84;
const CIRC = 2 * Math.PI * R;

/** Rotating circular seal: the text is stretched to exactly one lap of the ring. */
function Seal({ text, count }: { text: string; count: number }) {
  const id = useId().replace(/:/g, "");
  // Repeat short phrases so a lap is filled without squeezing glyphs together
  // (~7.6 units per bold caps glyph at this size).
  const reps = Math.max(1, Math.floor(CIRC / (text.length * 7.6)));
  const ring = text.repeat(reps);
  return (
    <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px]">
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-[orbit-cw_30s_linear_infinite] motion-reduce:animate-none" aria-hidden>
        <defs>
          <path id={`seal-${id}`} d={`M100,100 m-${R},0 a${R},${R} 0 1,1 ${R * 2},0 a${R},${R} 0 1,1 -${R * 2},0`} />
        </defs>
        <text style={{ fontSize: 11.5, fontWeight: 700, fill: "var(--content-secondary)" }}>
          <textPath href={`#seal-${id}`} textLength={CIRC - 6} lengthAdjust="spacing">{ring}</textPath>
        </text>
      </svg>
      <div className="absolute inset-[22%] rounded-full flex flex-col items-center justify-center"
        style={{ background: "var(--hero-accent-gradient)", boxShadow: "0 18px 50px rgba(var(--warm-glow),0.40)" }}>
        <ShieldCheck size={30} color="#fff" strokeWidth={1.7} />
        <span className="font-display font-bold text-white mt-1 leading-none" style={{ fontSize: 30 }}>{count}</span>
      </div>
      <div className="absolute inset-[14%] rounded-full pointer-events-none" style={{ border: "1px dashed var(--border)" }} />
    </div>
  );
}

export function Accreditation({ index, locale, certificates }: { index: number; locale: string; certificates: Certificate[] }) {
  return (
    <section className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-5">
          <SectionLabel index={index} label={tr(T.accreditation, locale)} />
          <h2 className="font-display font-bold leading-[1.05] tracking-[-0.02em] mb-5" style={{ fontSize: "clamp(32px,3.8vw,56px)", color: "var(--content)" }}>
            {tr(T.accreditationTitle, locale)}
          </h2>
          <p className="max-w-md leading-relaxed mb-10" style={{ fontSize: 17, color: "var(--content-secondary)" }}>{tr(T.accreditationSub, locale)}</p>
          <Seal text={tr(T.seal, locale)} count={certificates.length} />
        </div>

        <div className="lg:col-span-7 lg:pt-24">
          <ul style={{ borderTop: "1px solid var(--border)" }}>
            {certificates.map((c, i) => {
              const Icon = c.is_international ? Award : ShieldCheck;
              const rgb = c.is_international ? "56,189,248" : "16,185,129";
              return (
                <motion.li key={c.id}
                  initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                  className="grid grid-cols-[auto,1fr] gap-5 sm:gap-7 py-8" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span className="flex items-center justify-center w-12 h-12 rounded-full" style={{ background: `rgba(${rgb},0.12)`, border: `1px solid rgba(${rgb},0.35)` }}>
                    <Icon size={20} style={{ color: `rgb(${rgb})` }} />
                  </span>
                  <div className="min-w-0">
                    <span className="inline-block mb-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: `rgb(${rgb})` }}>
                      {tr(c.is_international ? T.intl : T.national, locale)}
                    </span>
                    <h3 className="font-display font-semibold leading-snug" style={{ fontSize: "clamp(17px,1.5vw,22px)", color: "var(--content)" }}>{c.name}</h3>
                    {c.issuing_organization && (
                      <p className="mt-2 text-sm" style={{ color: "var(--content-muted)" }}>{c.issuing_organization}</p>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ul>
          <Link href={`/${locale}/certificates`} className="group inline-flex items-center gap-2 mt-8 text-sm font-semibold" style={{ color: "var(--accent)" }}>
            {tr(T.allCerts, locale)}
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
