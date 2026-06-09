"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Division } from "@/types/api";
import { mediaUrl } from "@/lib/utils";
import { staggerContainer, fadeUp, fadeLeft, VIEWPORT } from "@/lib/motion";
import { MeshBlobs } from "@/components/ui/MeshBlobs";

interface Props {
  divisions: Division[];
  locale: string;
  title: string;
  subtitle: string;
  viewAll: string;
  viewDetail: string;
}

export function DivisionsPreview({ divisions, locale, title, subtitle, viewAll, viewDetail }: Props) {
  return (
    <section className="relative py-24 overflow-hidden">
      <MeshBlobs variant="default" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-5">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.20em] mb-3"
              style={{ color: "#3B82F6" }}
            >
              Bo&apos;linmalar
            </span>
            <h2
              className="font-display font-bold text-content leading-tight"
              style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}
            >
              {title}
            </h2>
            <p className="mt-3 max-w-lg" style={{ color: "#7B93B8" }}>
              {subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href={`/${locale}/divisions`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shrink-0"
              style={{
                background: "rgba(59,130,246,0.10)",
                border: "1px solid rgba(59,130,246,0.25)",
                color: "#60A5FA",
              }}
            >
              {viewAll}
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {divisions.slice(0, 6).map((div) => (
            <motion.div key={div.id} variants={fadeUp}>
              <Link
                href={`/${locale}/divisions/${div.slug}`}
                className="group block rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: "rgba(9,18,42,0.65)",
                  border: "1px solid rgba(59,130,246,0.12)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
              >
                {/* Cover image */}
                <div className="relative h-44 overflow-hidden" style={{ background: "rgba(5,10,23,0.80)" }}>
                  {div.cover_image ? (
                    <Image
                      src={mediaUrl(div.cover_image)}
                      alt={div.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, rgba(29,78,216,0.12) 0%, rgba(14,165,233,0.08) 100%)" }}
                    >
                      {div.logo ? (
                        <Image src={mediaUrl(div.logo)} alt={div.name} width={56} height={56} className="object-contain opacity-50" />
                      ) : (
                        <span className="text-5xl" style={{ color: "rgba(59,130,246,0.25)" }}>⚙</span>
                      )}
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ background: "linear-gradient(to top, rgba(9,18,42,0.90) 0%, transparent 60%)" }}
                  />
                  {/* Blue line at top on hover */}
                  <div
                    className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.80), transparent)" }}
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3
                    className="font-display font-semibold text-content mb-2 transition-colors duration-200 group-hover:text-blue-400"
                  >
                    {div.name}
                  </h3>
                  <p className="text-sm line-clamp-2 leading-relaxed mb-4" style={{ color: "#7B93B8" }}>
                    {div.short_description}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 group-hover:gap-2.5"
                    style={{ color: "#3B82F6" }}
                  >
                    {viewDetail}
                    <span>→</span>
                  </span>
                </div>

                {/* Bottom glow line on hover */}
                <div
                  className="h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.40), transparent)" }}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
