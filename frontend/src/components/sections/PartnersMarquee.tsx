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

function LogoCard({ partner }: { partner: Partner }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -2 }}
      transition={{ type: "spring", stiffness: 340, damping: 24 }}
      className="shrink-0 flex items-center justify-center rounded-2xl cursor-pointer"
      style={{
        width: "200px",
        height: "96px",
        background: "rgba(255, 255, 255, 0.96)",
        borderRadius: "16px",
        boxShadow: "0 2px 20px rgba(0,0,0,0.25), 0 0 0 1px rgba(59,130,246,0.06)",
        padding: "0 28px",
        transition: "box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 32px rgba(0,0,0,0.35), 0 0 0 2px rgba(59,130,246,0.25)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 2px 20px rgba(0,0,0,0.25), 0 0 0 1px rgba(59,130,246,0.06)";
      }}
    >
      {partner.logo ? (
        <Image
          src={mediaUrl(partner.logo)}
          alt={partner.name}
          width={130}
          height={52}
          className="object-contain max-h-[52px] w-auto"
          style={{ maxWidth: "130px" }}
        />
      ) : (
        <span
          className="text-sm font-bold text-center leading-tight"
          style={{ color: "#1e293b" }}
        >
          {partner.name}
        </span>
      )}
    </motion.div>
  );
}

export function PartnersMarquee({ partners, title, subtitle }: Props) {
  if (partners.length === 0) return null;

  // Ensure enough items for smooth infinite loop (minimum 6 per row)
  const minItems = 6;
  const multiplier = Math.ceil((minItems * 2) / partners.length);
  const items = Array.from({ length: multiplier }, () => partners).flat();

  // Split into two rows for the two-row design
  // Row 1 starts from index 0, row 2 offset by half
  const row1 = [...items, ...items];
  const row2 = [...items.slice(Math.floor(items.length / 2)), ...items, ...items.slice(0, Math.floor(items.length / 2))];

  return (
    <section className="py-20 overflow-hidden">

      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 text-center">
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
          <p className="mt-3 max-w-xl mx-auto" style={{ color: "#7B93B8" }}>
            {subtitle}
          </p>
        </motion.div>
      </div>

      {/* Two-row marquee */}
      <div className="relative space-y-4">

        {/* Edge fade masks */}
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-36 z-10"
          style={{ background: "linear-gradient(to right, #050A17 0%, transparent 100%)" }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-36 z-10"
          style={{ background: "linear-gradient(to left, #050A17 0%, transparent 100%)" }}
        />

        {/* Row 1 — scroll right → */}
        <div className="flex gap-4 marquee-track" style={{ width: "max-content" }}>
          {row1.map((partner, i) => (
            <LogoCard key={`r1-${partner.id}-${i}`} partner={partner} />
          ))}
        </div>

        {/* Row 2 — scroll left ← */}
        <div className="flex gap-4 marquee-track-reverse" style={{ width: "max-content" }}>
          {row2.map((partner, i) => (
            <LogoCard key={`r2-${partner.id}-${i}`} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}
