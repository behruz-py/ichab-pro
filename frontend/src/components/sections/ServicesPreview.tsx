"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/types/api";
import { fadeUp, VIEWPORT } from "@/lib/motion";
import { MeshBlobs } from "@/components/ui/MeshBlobs";
import { ServiceGroups } from "@/components/sections/ServiceGroups";

interface Props {
  services: Service[];
  locale: string;
  title: string;
  subtitle: string;
  viewAll?: string;
}

/** Home page "Xizmatlarimiz" section — reuses the same division-grouped
 * ServiceGroups grid as the standalone /services page, so the two read as
 * one consistent view instead of two different designs of the same data. */
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

        <ServiceGroups services={services} locale={locale} />

        {/* Single CTA to the full services page */}
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
