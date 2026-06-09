"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Service } from "@/types/api";
import { staggerContainer, fadeUp, VIEWPORT } from "@/lib/motion";
import { ShimmerCard } from "@/components/ui/ShimmerCard";
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
    <section className="relative py-20 bg-surface-secondary/20 overflow-hidden">
      <MeshBlobs variant="services" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-content mb-3">{title}</h2>
          <p className="text-content-secondary max-w-xl mx-auto">{subtitle}</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.slice(0, 6).map((svc, i) => (
            <motion.div key={svc.id} variants={fadeUp} whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
              <ShimmerCard
                className="h-full"
                speed={i % 3 === 0 ? "slow" : i % 3 === 1 ? "normal" : "fast"}
                intensity="subtle"
              >
                <Link
                  href={`/${locale}/services/${svc.slug}`}
                  className="group block h-full p-6 rounded-2xl hover:bg-white/[0.03] transition-colors duration-300"
                >
                  {svc.icon && (
                    <div className="mb-4 w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                      <DynamicIcon name={svc.icon} size={20} />
                    </div>
                  )}
                  <h3 className="font-display font-semibold text-content mb-2 group-hover:text-accent transition-colors">
                    {svc.name}
                  </h3>
                  <p className="text-content-secondary text-sm line-clamp-3 leading-relaxed mb-4">
                    {svc.short_description}
                  </p>
                  {svc.price_from && (
                    <p className="text-accent text-xs font-medium mb-3">{svc.price_from}</p>
                  )}
                  <span className="inline-flex items-center gap-1 text-accent text-xs font-medium group-hover:gap-2 transition-all">
                    {learnMore}
                    <motion.span
                      className="inline-block"
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >→</motion.span>
                  </span>
                </Link>
              </ShimmerCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
