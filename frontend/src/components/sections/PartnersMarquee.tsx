"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Partner } from "@/types/api";
import { mediaUrl } from "@/lib/utils";
import { fadeUp, VIEWPORT } from "@/lib/motion";

interface Props {
  partners: Partner[];
  title: string;
  subtitle: string;
}

export function PartnersMarquee({ partners, title, subtitle }: Props) {
  const doubled = [...partners, ...partners];

  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="font-display text-3xl md:text-4xl font-bold text-content mb-3"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-content-secondary"
        >
          {subtitle}
        </motion.p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-surface to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-surface to-transparent" />

        <div className="flex gap-8 marquee-track">
          {doubled.map((partner, i) => (
            <motion.div
              key={`${partner.id}-${i}`}
              whileHover={{ scale: 1.08, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="shrink-0 flex items-center justify-center glass-card rounded-2xl border border-border-subtle px-8 py-5 w-44 h-20 hover:border-accent/40 transition-colors cursor-pointer"
            >
              {partner.logo ? (
                <Image
                  src={mediaUrl(partner.logo)}
                  alt={partner.name}
                  width={100}
                  height={40}
                  className="object-contain max-h-10 opacity-70 hover:opacity-100 transition-opacity"
                />
              ) : (
                <span className="text-content-secondary text-sm font-medium text-center leading-tight">
                  {partner.name}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
