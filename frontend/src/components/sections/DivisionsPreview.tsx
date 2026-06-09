"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Division } from "@/types/api";
import { mediaUrl } from "@/lib/utils";
import { staggerContainer, fadeUp, fadeLeft, VIEWPORT } from "@/lib/motion";
import { TiltCard } from "@/components/ui/TiltCard";
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
    <section className="relative py-20 overflow-hidden">
      <MeshBlobs variant="default" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
          <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-content mb-3">{title}</h2>
            <p className="text-content-secondary max-w-lg">{subtitle}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href={`/${locale}/divisions`}
              className="btn-glass-primary shrink-0 px-5 py-2.5 text-sm"
            >
              {viewAll} →
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {divisions.slice(0, 6).map((div) => (
            <motion.div key={div.id} variants={fadeUp}>
              <TiltCard className="h-full">
                <Link
                  href={`/${locale}/divisions/${div.slug}`}
                  className="group glass-card rounded-2xl overflow-hidden border border-border-subtle hover:border-accent/50 transition-all duration-300 hover:shadow-[0_0_24px_var(--accent-glow),0_0_0_1px_rgba(1,172,180,0.4)] block h-full"
                >
                  <div className="relative h-44 bg-surface-secondary overflow-hidden">
                    {div.cover_image ? (
                      <Image
                        src={mediaUrl(div.cover_image)}
                        alt={div.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent-secondary/10">
                        {div.logo ? (
                          <Image src={mediaUrl(div.logo)} alt={div.name} width={60} height={60} className="object-contain opacity-60" />
                        ) : (
                          <span className="text-4xl text-accent/40">⚙</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-content mb-2 group-hover:text-accent transition-colors">
                      {div.name}
                    </h3>
                    <p className="text-content-secondary text-sm line-clamp-2 leading-relaxed">
                      {div.short_description}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-3 text-accent text-xs font-medium">
                      {viewDetail}
                      <motion.span
                        className="inline-block"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >→</motion.span>
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
