"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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

export function HeroSection({
  locale,
  badge,
  title,
  titleAccent,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  scrollHint,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const bgY      = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const imageY   = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const opacity  = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden flex items-center"
    >
      {/* Background — parallax shift only, body handles the gradient */}
      <motion.div className="absolute inset-0" style={{ y: bgY }} />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient orb - left bottom */}
      <motion.div
        className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        animate={{ scale: [1, 1.12, 1], opacity: [0.06, 0.11, 0.06] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      >
        <div className="w-full h-full rounded-full bg-accent blur-[120px]" />
      </motion.div>

      {/* Ambient orb - right top (light mode accent) */}
      <motion.div
        className="absolute top-[-5%] right-[15%] w-[520px] h-[520px] rounded-full pointer-events-none"
        animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.14, 0.08] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        aria-hidden
      >
        <div className="w-full h-full rounded-full bg-accent blur-[140px]" />
      </motion.div>

      {/* ── Hero gear image ────────────────────────────────────────────────── */}
      {/* Covers right 58% of hero. Mix-blend-mode handled per-theme in CSS.   */}
      {/* Aggressive left-fade mask hides the text panel inside the image.     */}
      <motion.div
        style={{ y: imageY }}
        className="absolute right-0 top-0 bottom-0 w-[58%] pointer-events-none hidden lg:block"
        aria-hidden
      >
        <div
          className="hero-gear-image w-full h-full relative"
          style={{
            /* Soft left edge blend — text panel and gear both fully visible  */
            maskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 12%, black 28%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 12%, black 28%)",
          }}
        >
          <Image
            src="/hero-gear.png"
            alt=""
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "60% center" }}
          />
        </div>

        {/* Bottom fade — seamless merge with next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(to top, var(--surface) 0%, transparent 100%)" }}
        />
      </motion.div>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-[52%] lg:max-w-[48%]"
        >
          {/* Badge */}
          <motion.div variants={fadeIn} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-accent/30 text-accent text-sm font-medium">
              <motion.span
                className="w-2 h-2 rounded-full bg-accent flex-shrink-0"
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              />
              {badge}
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl md:text-6xl lg:text-[64px] font-bold text-content mb-6 leading-[1.06] tracking-tight"
          >
            {title}
            <br />
            <motion.span
              className="text-gradient inline-block"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              {titleAccent}
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-content-secondary text-lg md:text-xl max-w-md mb-10 leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={`/${locale}/contact`}
                className="btn-glass-primary px-8 py-4 text-base"
              >
                {ctaPrimary}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={`/${locale}/projects`}
                className="btn-glass-secondary px-8 py-4 text-base"
              >
                {ctaSecondary}
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll hint */}
          <motion.p
            variants={fadeIn}
            className="mt-16 text-content-muted text-sm flex items-center gap-2"
          >
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              ↓
            </motion.span>
            {scrollHint}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* ── Tech badges — far right edge, clear of image text ─────────────── */}
      <motion.div
        className="absolute right-10 xl:right-14 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2.5 z-20"
        initial="hidden"
        animate="visible"
      >
        {["PLC", "SCADA", "HMI", "VFD", "IoT"].map((tech, i) => (
          <motion.div
            key={tech}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ x: -3, scale: 1.06 }}
            className="px-3.5 py-1.5 glass-card border border-accent/25 rounded-lg text-accent text-xs font-mono font-semibold cursor-default select-none backdrop-blur-xl"
          >
            {tech}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
