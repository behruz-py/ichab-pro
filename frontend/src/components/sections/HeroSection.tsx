"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { staggerContainer, fadeUp, fadeIn } from "@/lib/motion";

interface Props {
  locale: string;
  badge: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  scrollHint: string;
}

const TECH_TAGS = ["PLC", "SCADA", "HMI", "VFD", "IoT", "DCS"];

const FLOAT_CARDS = [
  { label: "Loyihalar", value: "150+", delay: 0,   dur: 5,   dir: -8,  pos: "top-[-28px] right-[60px]" },
  { label: "Texnologiya", value: "PLC / SCADA", delay: 1, dur: 6, dir: 7, pos: "top-[38%] right-[-70px]" },
  { label: "Tajriba",   value: "25+ yil",  delay: 2,   dur: 7,   dir: 8,   pos: "bottom-[-24px] left-[50%] -translate-x-1/2" },
  { label: "Sertifikat", value: "ISO 9001", delay: 0.5, dur: 5.5, dir: -6, pos: "top-[38%] left-[-72px]" },
];

export function HeroSection({ locale, badge, title, titleAccent, subtitle, ctaPrimary, ctaSecondary, scrollHint }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const opacity  = useTransform(scrollYProgress, [0, 0.7],  [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(59,130,246,0.25) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.35,
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* Ambient orb — top right */}
      <div className="absolute -top-[20%] right-[5%] w-[750px] h-[750px] rounded-full pointer-events-none">
        <div className="w-full h-full rounded-full bg-blue-600 blur-[180px] opacity-[0.14]" />
      </div>
      {/* Ambient orb — bottom left */}
      <div className="absolute -bottom-[15%] -left-[8%] w-[550px] h-[550px] rounded-full pointer-events-none">
        <div className="w-full h-full rounded-full bg-sky-500 blur-[160px] opacity-[0.08]" />
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16 xl:gap-20">

          {/* Left: text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex-1 min-w-0 lg:max-w-[52%]"
          >
            {/* Badge */}
            <motion.div variants={fadeIn} className="mb-8">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.24)", color: "#60A5FA" }}
              >
                <motion.span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: "#60A5FA" }}
                  animate={{ scale: [1, 1.7, 1], opacity: [1, 0.35, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                />
                {badge}
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              variants={fadeUp}
              className="font-display font-bold text-content mb-6 leading-[1.04] tracking-tight"
              style={{ fontSize: "clamp(40px, 5.5vw, 78px)" }}
            >
              {title}
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 45%, #38BDF8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {titleAccent}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-lg leading-relaxed max-w-[440px] mb-10"
              style={{ color: "#7B93B8" }}
            >
              {subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)",
                    boxShadow: "0 8px 32px rgba(59,130,246,0.38), inset 0 1px 0 rgba(255,255,255,0.18)",
                  }}
                >
                  {ctaPrimary}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={`/${locale}/projects`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "#7B93B8",
                  }}
                >
                  {ctaSecondary}
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Tech tags */}
            <motion.div variants={fadeIn} className="flex flex-wrap gap-2">
              {TECH_TAGS.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0 + i * 0.07, duration: 0.35 }}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-semibold"
                  style={{
                    background: "rgba(59,130,246,0.07)",
                    border: "1px solid rgba(59,130,246,0.20)",
                    color: "#60A5FA",
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: geometric orb decoration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex flex-shrink-0 items-center justify-center mt-16 lg:mt-0"
          >
            <div className="relative w-[400px] h-[400px] xl:w-[460px] xl:h-[460px]">

              {/* Glow behind */}
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(59,130,246,0.20) 0%, rgba(59,130,246,0.05) 55%, transparent 80%)", filter: "blur(16px)" }}
              />

              {/* Outer dashed ring — slow rotate */}
              <motion.div
                className="absolute inset-0 rounded-full border border-dashed"
                style={{ borderColor: "rgba(59,130,246,0.18)" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
              />

              {/* Outer ring — counter rotate (slow) */}
              <motion.div
                className="absolute inset-[30px] rounded-full border border-dashed"
                style={{ borderColor: "rgba(96,165,250,0.12)" }}
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              />

              {/* Middle solid ring */}
              <div
                className="absolute inset-[65px] rounded-full border"
                style={{
                  borderColor: "rgba(59,130,246,0.28)",
                  boxShadow: "0 0 50px rgba(59,130,246,0.10), inset 0 0 50px rgba(59,130,246,0.04)",
                }}
              />

              {/* Inner ring */}
              <div
                className="absolute inset-[115px] rounded-full border"
                style={{ borderColor: "rgba(96,165,250,0.35)", boxShadow: "0 0 30px rgba(59,130,246,0.15)" }}
              />

              {/* Center filled orb */}
              <div
                className="absolute inset-[155px] rounded-full"
                style={{
                  background: "radial-gradient(circle at 35% 35%, rgba(96,165,250,0.45) 0%, rgba(37,99,235,0.35) 50%, rgba(14,165,233,0.20) 100%)",
                  boxShadow: "0 0 60px rgba(59,130,246,0.35), 0 0 120px rgba(59,130,246,0.10)",
                  border: "1px solid rgba(147,197,253,0.45)",
                }}
              />

              {/* Orbiting dot on outer ring */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                  style={{ background: "#60A5FA", boxShadow: "0 0 12px rgba(96,165,250,0.80)" }}
                />
              </motion.div>

              {/* Orbiting dot (opposite, inner ring) */}
              <motion.div
                className="absolute inset-[65px]"
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                  style={{ background: "#38BDF8", boxShadow: "0 0 10px rgba(56,189,248,0.85)" }}
                />
              </motion.div>

              {/* ── Floating info cards ──────────────────────────────────── */}
              {FLOAT_CARDS.map((card, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${card.pos} px-4 py-2.5 rounded-2xl`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: [0, card.dir, 0],
                  }}
                  transition={{
                    opacity: { delay: 0.8 + card.delay * 0.15, duration: 0.5 },
                    scale:   { delay: 0.8 + card.delay * 0.15, duration: 0.5 },
                    y: { duration: card.dur, repeat: Infinity, ease: "easeInOut", delay: card.delay },
                  }}
                  style={{
                    background: "rgba(7,14,31,0.88)",
                    border: "1px solid rgba(59,130,246,0.28)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.40), 0 0 0 1px rgba(59,130,246,0.06)",
                  }}
                >
                  <div className="text-[9px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "rgba(96,165,250,0.55)" }}>
                    {card.label}
                  </div>
                  <div className="font-display font-bold text-sm text-white whitespace-nowrap">
                    {card.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: "1.5px solid rgba(59,130,246,0.35)" }}
        >
          <div className="w-1 h-2.5 rounded-full" style={{ background: "rgba(96,165,250,0.70)" }} />
        </motion.div>
        <span className="text-[10px] font-medium tracking-wider uppercase" style={{ color: "#344768" }}>
          {scrollHint}
        </span>
      </motion.div>
    </section>
  );
}
