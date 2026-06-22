"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/types/api";
import { staggerContainer, fadeUp, VIEWPORT } from "@/lib/motion";
import { MeshBlobs } from "@/components/ui/MeshBlobs";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

interface Props {
  services: Service[];
  locale: string;
  title: string;
  subtitle: string;
  learnMore: string;
}

export function ServicesPreview({ services, locale, title, subtitle, learnMore }: Props) {
  return (
    <section className="relative py-24 overflow-hidden" style={{ background: "rgba(7,14,31,0.50)" }}>
      <MeshBlobs variant="services" />

      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(59,130,246,0.20) 50%,transparent)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.20em] mb-3" style={{ color: "#3B82F6" }}>Xizmatlar</span>
          <h2 className="font-display font-bold text-content" style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}>
            {title}
          </h2>
          <p className="mt-3 max-w-xl mx-auto" style={{ color: "#7B93B8" }}>{subtitle}</p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.slice(0, 6).map((svc, i) => (
            <motion.div
              key={svc.id}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {/* Shimmer border wrapper */}
              <div className="shimmer-wrapper h-full" style={{ "--shimmer-speed": "7s", "--shimmer-opacity": "0.18" } as React.CSSProperties}>
                <Link
                  href={`/${locale}/services/${svc.slug}`}
                  className="shimmer-inner group flex flex-col h-full p-6 rounded-2xl transition-colors duration-300"
                  style={{ display: "flex" }}
                >
                  {/* Icon + number row */}
                  <div className="flex items-start justify-between mb-5">
                    {svc.icon ? (
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{ background: "rgba(59,130,246,0.10)", border: "1px solid rgba(59,130,246,0.22)" }}
                      >
                        <DynamicIcon name={svc.icon} size={22} className="text-blue-400" />
                      </div>
                    ) : <div />}

                    <span className="text-[11px] font-bold font-mono" style={{ color: "rgba(96,165,250,0.35)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-content mb-2 transition-colors duration-200 group-hover:text-blue-400">
                    {svc.name}
                  </h3>
                  <p className="text-sm line-clamp-3 leading-relaxed mb-5 flex-1" style={{ color: "#7B93B8" }}>
                    {svc.short_description}
                  </p>

                  {svc.price_from && (
                    <p className="text-xs font-medium mb-4" style={{ color: "#60A5FA" }}>{svc.price_from}</p>
                  )}

                  {/* Learn more — slides on hover */}
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 group-hover:gap-3"
                      style={{ color: "#3B82F6" }}
                    >
                      {learnMore} <ArrowRight size={14} />
                    </span>
                    {/* Arrow circle */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                      style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.30)" }}
                    >
                      <ArrowRight size={13} style={{ color: "#60A5FA" }} />
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
