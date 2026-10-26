"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Cog } from "lucide-react";
import type { Service } from "@/types/api";
import { mediaUrl } from "@/lib/utils";
import { resolveIcon } from "@/components/ui/DynamicIcon";
import { SectionLabel } from "@/components/editorial/SectionLabel";
import { EASE } from "@/components/editorial/hooks";

const PALETTE = ["245,158,11", "56,189,248", "16,185,129", "139,92,246", "236,72,153", "6,182,212"];

// Bento spans for the first five tiles (one hero tile + four around it);
// anything beyond falls back to a regular third-width tile.
const SPANS = [
  "lg:col-span-4 lg:row-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-3",
  "lg:col-span-3",
];

const imageOf = (s: Service) => s.cover_image || s.images?.find((i) => i.is_main)?.image || s.images?.[0]?.image || null;

function Tile({ s, i, locale }: { s: Service; i: number; locale: string }) {
  const c = PALETTE[i % PALETTE.length];
  const Icon = resolveIcon(s.icon) ?? Cog;
  const [failed, setFailed] = useState(false);
  const img = failed ? null : imageOf(s);
  const hero = i === 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: EASE }}
      className={`${SPANS[i] ?? "lg:col-span-2"} ${hero ? "sm:col-span-2 min-h-[420px]" : "min-h-[260px]"}`}>
      <Link href={`/${locale}/services`}
        className="group relative flex h-full flex-col justify-end overflow-hidden rounded-[24px] p-6 sm:p-7 text-white isolate"
        style={{ background: "#071226" }}>
        {img ? (
          <Image src={mediaUrl(img)} alt={s.name} fill sizes={hero ? "(max-width:1024px) 100vw, 66vw" : "(max-width:1024px) 100vw, 33vw"}
            className="object-cover -z-10 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]" onError={() => setFailed(true)} />
        ) : (
          <div className="absolute inset-0 -z-10" aria-hidden
            style={{ background: `radial-gradient(ellipse 85% 75% at 85% 10%, rgba(${c},0.42), transparent 62%), linear-gradient(160deg, #0c1a33 0%, #050b18 100%)` }}>
            <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]" style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: hero ? "56px 56px" : "40px 40px",
              maskImage: "radial-gradient(ellipse 80% 80% at 80% 20%, black, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 80% 20%, black, transparent 75%)",
            }} />
            <Icon className="absolute transition-transform duration-[1200ms] ease-out group-hover:scale-110 group-hover:-rotate-6"
              strokeWidth={0.8}
              style={{ color: `rgba(${c},0.55)`, width: hero ? 240 : 140, height: hero ? 240 : 140, right: hero ? "6%" : "4%", top: hero ? "8%" : "6%" }} />
          </div>
        )}
        <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(to top, rgba(3,8,20,0.94) 0%, rgba(3,8,20,0.55) 45%, rgba(3,8,20,0.05) 80%)" }} />

        <div className="absolute top-5 left-6 sm:top-6 sm:left-7 right-6 flex items-start justify-between gap-3">
          {s.division_name ? (
            <span className="block truncate px-2.5 py-1 rounded-full text-[11px] font-semibold leading-tight max-w-[80%]"
              style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.16)", backdropFilter: "blur(8px)" }}>
              {s.division_name}
            </span>
          ) : <span />}
          <span className="font-mono text-xs font-bold" style={{ color: `rgb(${c})` }}>{String(i + 1).padStart(2, "0")}</span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-display font-semibold leading-snug first-letter:uppercase" style={{ fontSize: hero ? "clamp(22px,2.2vw,34px)" : "clamp(17px,1.4vw,21px)" }}>
              {s.name}
            </h3>
            {s.short_description && (
              <p className={`mt-2.5 text-sm leading-relaxed text-white/70 ${hero ? "line-clamp-3 max-w-xl" : "line-clamp-2"}`}>{s.short_description}</p>
            )}
          </div>
          <span className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full transition-all duration-500 group-hover:rotate-45"
            style={{ background: `rgb(${c})`, color: "#06101f" }}>
            <ArrowUpRight size={18} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function ServicesShowcase({
  index, label, locale, services, title, subtitle, viewAll,
}: {
  index: number; label: string; locale: string; services: Service[]; title: string; subtitle: string; viewAll: string;
}) {
  return (
    <section className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <div className="grid lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-7">
          <SectionLabel index={index} label={label} />
          <h2 className="font-display font-bold leading-[1.05] tracking-[-0.02em]" style={{ fontSize: "clamp(34px,4.2vw,64px)", color: "var(--content)" }}>{title}</h2>
        </div>
        <div className="lg:col-span-5 lg:self-end">
          <p className="leading-relaxed" style={{ fontSize: 17, color: "var(--content-secondary)" }}>{subtitle}</p>
          <Link href={`/${locale}/services`} className="group inline-flex items-center gap-2 mt-5 text-sm font-semibold" style={{ color: "var(--accent)" }}>
            {viewAll} <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-6 lg:auto-rows-[260px] gap-4 sm:gap-5">
        {services.slice(0, 8).map((s, i) => <Tile key={s.id} s={s} i={i} locale={locale} />)}
      </div>
    </section>
  );
}
