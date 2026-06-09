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
    <section className="py-20 overflow-hidden">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.20em] mb-3"
            style={{ color: "#3B82F6" }}
          >
            Hamkorlar
          </span>
          <h2
            className="font-display font-bold text-content"
            style={{ fontSize: "clamp(26px, 3vw, 40px)" }}
          >
            {title}
          </h2>
          <p className="mt-3" style={{ color: "#7B93B8" }}>
            {subtitle}
          </p>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Edge fades */}
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-28 z-10"
          style={{ background: "linear-gradient(to right, #050A17, transparent)" }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-28 z-10"
          style={{ background: "linear-gradient(to left, #050A17, transparent)" }}
        />

        <div className="flex gap-5 marquee-track">
          {doubled.map((partner, i) => (
            <motion.div
              key={`${partner.id}-${i}`}
              whileHover={{ scale: 1.06, y: -3 }}
              transition={{ type: "spring", stiffness: 320 }}
              className="shrink-0 flex items-center justify-center rounded-2xl cursor-pointer"
              style={{
                background: "rgba(9,18,42,0.60)",
                border: "1px solid rgba(59,130,246,0.12)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                width: "176px",
                height: "88px",
                padding: "0 24px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
                transition: "border-color 0.25s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(59,130,246,0.35)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.30), 0 0 20px rgba(59,130,246,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(59,130,246,0.12)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.25)";
              }}
            >
              {partner.logo ? (
                <Image
                  src={mediaUrl(partner.logo)}
                  alt={partner.name}
                  width={110}
                  height={44}
                  className="object-contain max-h-11 transition-all duration-250"
                  style={{ opacity: 0.65, filter: "brightness(1.1)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "1"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.65"; }}
                />
              ) : (
                <span className="text-sm font-medium text-center leading-tight" style={{ color: "#7B93B8" }}>
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
