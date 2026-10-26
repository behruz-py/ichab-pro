"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE, T, tr } from "./copy";

/** Button that leans toward the cursor and springs back when it leaves. */
function MagneticLink({ href, children }: { href: string; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  return (
    <motion.div style={{ x: sx, y: sy }} className="inline-block"
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.35);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}>
      <Link href={href}
        className="group inline-flex items-center gap-3 pl-8 pr-3 py-3 rounded-full font-semibold text-white text-base sm:text-lg transition-shadow duration-300"
        style={{ background: "var(--warm-btn)", boxShadow: "0 16px 44px rgba(var(--warm-glow),0.40)" }}>
        {children}
        <span className="flex items-center justify-center w-11 h-11 rounded-full bg-white/20 transition-transform duration-500 group-hover:rotate-45">
          <ArrowUpRight size={20} />
        </span>
      </Link>
    </motion.div>
  );
}

export function FinaleCta({ locale }: { locale: string }) {
  const lines = [tr(T.ctaLine1, locale), tr(T.ctaLine2, locale)];
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden
        style={{ background: "radial-gradient(ellipse 50% 45% at 50% 55%, rgba(var(--accent-rgb),0.13), transparent 72%)" }} />
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-40 text-center">
        <span className="inline-block mb-8 text-xs font-bold uppercase tracking-[0.28em]" style={{ color: "var(--accent)" }}>{tr(T.ctaEyebrow, locale)}</span>
        <h2 className="font-display font-bold leading-[0.98] tracking-[-0.03em]" style={{ fontSize: "clamp(42px, 7.6vw, 128px)", color: "var(--content)" }}>
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <motion.span className="inline-block"
                initial={{ y: "105%" }} whileInView={{ y: "0%" }} viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1, delay: i * 0.12, ease: EASE }}
                style={i === 1 ? { background: "var(--hero-accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" } : undefined}>
                {line}
              </motion.span>
            </span>
          ))}
        </h2>
        <p className="mt-8 mb-12 max-w-xl mx-auto leading-relaxed" style={{ fontSize: 18, color: "var(--content-secondary)" }}>{tr(T.ctaText, locale)}</p>
        <MagneticLink href={`/${locale}/contact`}>{tr(T.ctaBtn, locale)}</MagneticLink>
      </div>
    </section>
  );
}
