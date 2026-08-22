"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import type { Service } from "@/types/api";
import { staggerContainer, fadeUp, VIEWPORT } from "@/lib/motion";
import { MeshBlobs } from "@/components/ui/MeshBlobs";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

interface Props {
  services: Service[];
  locale: string;
  title: string;
  subtitle: string;
  viewAll?: string;
}

// Same rotating accent palette used on the lab pages — keeps the whole site
// feeling like one system instead of each section inventing its own colors.
const PALETTE = ["56,189,248", "16,185,129", "139,92,246", "245,158,11", "236,72,153", "6,182,212"];

export function ServicesPreview({ services, locale, title, subtitle, viewAll }: Props) {
  return (
    <section className="relative py-24 overflow-hidden" style={{ background: "rgba(var(--surface-2-rgb),0.50)" }}>
      <MeshBlobs variant="services" />

      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(var(--accent-rgb),0.20) 50%,transparent)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.20em] mb-3" style={{ color: "var(--accent)" }}>Xizmatlar</span>
          <h2 className="font-display font-bold text-content" style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}>
            {title}
          </h2>
          <p className="mt-3 max-w-xl mx-auto" style={{ color: "var(--content-secondary)" }}>{subtitle}</p>
        </motion.div>

        {/* Grid — hover reveals "why it matters" highlights instead of linking out */}
        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.slice(0, 6).map((svc, i) => {
            const rgb = PALETTE[i % PALETTE.length];
            const hasHighlights = (svc.highlights?.length ?? 0) > 0;
            return (
              <motion.div
                key={svc.id}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="group relative h-full rounded-2xl p-6 overflow-hidden"
                style={{ background: "var(--card-bg)", border: `1px solid rgba(${rgb},0.22)`, boxShadow: "var(--card-shadow)" }}
              >
                {/* Hover glow */}
                <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px rgba(${rgb},0.4), 0 18px 40px rgba(${rgb},0.16)` }} />

                {/* Icon + number */}
                <div className="relative flex items-start justify-between mb-5">
                  {svc.icon ? (
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{ background: `rgba(${rgb},0.14)`, border: `1px solid rgba(${rgb},0.3)` }}
                    >
                      <DynamicIcon name={svc.icon} size={22} style={{ color: `rgb(${rgb})` }} />
                    </div>
                  ) : <div />}

                  <span className="text-[11px] font-bold font-mono" style={{ color: `rgba(${rgb},0.45)` }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="relative font-display font-semibold text-content mb-2">
                  {svc.name}
                </h3>

                {/* Short description — fades out on hover to make room for highlights */}
                <p
                  className="relative text-sm leading-relaxed transition-opacity duration-300"
                  style={{ color: "var(--content-secondary)", opacity: hasHighlights ? undefined : 1 }}
                >
                  {svc.short_description}
                </p>

                {/* Highlights checklist — hidden until hover, only if the service has any */}
                {hasHighlights && (
                  <div className="relative service-highlights">
                    <ul className="flex flex-col gap-2">
                      {svc.highlights!.slice(0, 3).map((h, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="flex items-center justify-center rounded-md flex-shrink-0 mt-0.5" style={{ width: 16, height: 16, background: `rgba(${rgb},0.16)` }}>
                            <Check size={10} color={`rgb(${rgb})`} strokeWidth={3} />
                          </span>
                          <span className="text-xs leading-snug" style={{ color: "var(--content-secondary)" }}>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Single CTA — no more per-card "learn more" links out to individual pages */}
        {viewAll && (
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="text-center mt-12">
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: "var(--warm-btn)", boxShadow: "0 8px 24px rgba(var(--warm-glow),0.34)" }}
            >
              {viewAll} <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
