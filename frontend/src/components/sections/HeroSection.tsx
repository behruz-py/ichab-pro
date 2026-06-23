"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

export function HeroSection({ locale, badge, title, titleAccent, subtitle, ctaPrimary, ctaSecondary, scrollHint }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">

      {/* ── Hero visual — right side image ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        className="absolute inset-y-0 right-0 pointer-events-none"
        style={{ width: "58%" }}
      >
        <Image
          src={`/hero-visual-${locale}.png`}
          alt=""
          fill
          className="object-cover object-center"
          style={{ opacity: 0.85 }}
          priority
        />
        {/* Left edge — fades into page background */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(229,234,241,1) 0%, rgba(229,234,241,0.45) 16%, rgba(229,234,241,0.06) 38%, transparent 56%)",
        }} />
        {/* Right edge */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to left, rgba(229,234,241,0.85) 0%, transparent 16%)",
        }} />
        {/* Top + bottom */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(229,234,241,0.55) 0%, transparent 18%, transparent 80%, rgba(229,234,241,0.60) 100%)",
        }} />
      </motion.div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(47,94,148,0.18) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.28,
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* Ambient orbs */}
      <div className="absolute -top-[20%] right-[5%] w-[600px] h-[600px] rounded-full pointer-events-none">
        <div className="w-full h-full rounded-full bg-blue-600 blur-[200px] opacity-[0.08]" />
      </div>

      {/* ── Main content ── */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-[580px]"
        >
          <motion.div variants={fadeIn} className="mb-8">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{ background: "rgba(47,94,148,0.08)", border: "1px solid rgba(47,94,148,0.24)", color: "#2F5E94" }}
            >
              <motion.span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: "#2F5E94" }}
                animate={{ scale: [1, 1.7, 1], opacity: [1, 0.35, 1] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              />
              {badge}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display font-bold text-content mb-6 leading-[1.04] tracking-tight"
            style={{ fontSize: "clamp(40px, 5.5vw, 78px)" }}
          >
            {title}
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #DE7216 0%, #EC7A18 45%, #F09A24 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {titleAccent}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg leading-relaxed mb-10"
            style={{ color: "#475569" }}
          >
            {subtitle}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-12">
            <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #EE8418 0%, #D2630E 100%)",
                  boxShadow: "0 8px 28px rgba(208,98,16,0.38), inset 0 1px 0 rgba(255,255,255,0.18)",
                }}
              >
                {ctaPrimary}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={`/${locale}/projects`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "#475569" }}
              >
                {ctaSecondary}
                <motion.span
                  className="inline-flex"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                ><ArrowRight size={18} /></motion.span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeIn} className="flex flex-wrap gap-2">
            {TECH_TAGS.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 + i * 0.07, duration: 0.35 }}
                className="px-3 py-1 rounded-lg text-xs font-mono font-semibold"
                style={{ background: "rgba(47,94,148,0.07)", border: "1px solid rgba(47,94,148,0.20)", color: "#2F5E94" }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
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
          style={{ border: "1.5px solid rgba(47,94,148,0.35)" }}
        >
          <div className="w-1 h-2.5 rounded-full" style={{ background: "rgba(47,94,148,0.70)" }} />
        </motion.div>
        <span className="text-[10px] font-medium tracking-wider uppercase" style={{ color: "#94A3B8" }}>
          {scrollHint}
        </span>
      </motion.div>
    </section>
  );
}
