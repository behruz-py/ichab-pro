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
const SHOWN = 7;
const MORE: Record<string, string> = { uz: "ta xizmat", ru: "услуг", en: "services" };

const imageOf = (s: Service) => s.cover_image || s.images?.find((i) => i.is_main)?.image || s.images?.[0]?.image || null;

/** Compact service card whose product photo breaks out above the frame. */
function Card({ s, i, locale }: { s: Service; i: number; locale: string }) {
  const c = PALETTE[i % PALETTE.length];
  const Icon = resolveIcon(s.icon) ?? Cog;
  const [failed, setFailed] = useState(false);
  const img = failed ? null : imageOf(s);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px 0px" }}
      transition={{ duration: 0.7, delay: (i % 4) * 0.07, ease: EASE }}
      className="pt-16 min-w-0 w-[80vw] shrink-0 snap-start sm:w-auto">
      <Link href={`/${locale}/services`}
        className="group relative flex h-full flex-col rounded-[24px] px-6 pb-6 pt-28 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5"
        style={{
          background: `linear-gradient(180deg, rgba(${c},0.16) 0%, rgba(${c},0.04) 38%, transparent 70%), var(--surface-card)`,
          border: `1px solid rgba(${c},0.22)`,
          boxShadow: "var(--card-shadow)",
        }}>
        {/* Out-of-frame visual: sits above the card's top edge */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-16 w-[78%] h-40 pointer-events-none">
          <div className="absolute inset-x-[12%] bottom-1 h-6 rounded-[50%] blur-xl transition-all duration-700 group-hover:inset-x-[20%] group-hover:opacity-60"
            style={{ background: `rgba(${c},0.55)` }} />
          {img ? (
            <Image src={mediaUrl(img)} alt={s.name} fill sizes="(max-width:640px) 80vw, 300px"
              onError={() => setFailed(true)}
              className="object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.28)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-3 group-hover:scale-[1.06]" />
          ) : (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-28 h-28 rounded-[28px] flex items-center justify-center rotate-[-6deg] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-3 group-hover:rotate-0"
              style={{ background: `linear-gradient(145deg, rgb(${c}), rgba(${c},0.6))`, boxShadow: `0 20px 40px rgba(${c},0.35), inset 0 1px 0 rgba(255,255,255,0.35)` }}>
              <Icon size={52} color="#fff" strokeWidth={1.4} />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="font-mono text-xs font-bold" style={{ color: `rgb(${c})` }}>{String(i + 1).padStart(2, "0")}</span>
          {s.division_name && (
            <span className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--content-muted)" }} title={s.division_name}>
              {s.division_name}
            </span>
          )}
        </div>
        <h3 className="font-display font-semibold leading-snug first-letter:uppercase mb-2" style={{ fontSize: "clamp(16px,1.2vw,18px)", color: "var(--content)" }}>{s.name}</h3>
        {s.short_description && (
          <p className="text-sm leading-relaxed line-clamp-2 mb-5" style={{ color: "var(--content-secondary)" }}>{s.short_description}</p>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: `rgb(${c})` }}>
          <span className="flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-500 group-hover:rotate-45" style={{ background: `rgba(${c},0.14)` }}>
            <ArrowUpRight size={16} />
          </span>
        </span>
      </Link>
    </motion.div>
  );
}

export function ServicesShowcase({
  index, label, locale, services, title, subtitle, viewAll,
}: {
  index: number; label: string; locale: string; services: Service[]; title: string; subtitle: string; viewAll: string;
}) {
  // Photographed services lead; the grid stays compact however many exist.
  const sorted = [...services].sort((a, b) => Number(!!imageOf(b)) - Number(!!imageOf(a)));
  const shown = sorted.slice(0, services.length > SHOWN + 1 ? SHOWN : SHOWN + 1);
  const rest = services.length - shown.length;
  // Literal classes (Tailwind scans for them) so no row is left with a lone card.
  const tiles = shown.length + (rest > 0 ? 1 : 0);
  const cols =
    tiles === 5 ? "lg:grid-cols-3 xl:grid-cols-5" :
    tiles === 6 || tiles === 3 ? "lg:grid-cols-3" :
    tiles <= 2 ? "lg:grid-cols-2" :
    "lg:grid-cols-4";

  return (
    <section className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <div className="grid lg:grid-cols-12 gap-8 mb-4">
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

      <div className={`flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 -mx-4 px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible sm:grid sm:grid-cols-2 ${cols} sm:gap-x-5 sm:gap-y-4`}>
        {shown.map((s, i) => <Card key={s.id} s={s} i={i} locale={locale} />)}
        {rest > 0 && (
          <div className="pt-16 w-[80vw] shrink-0 snap-start sm:w-auto">
            <Link href={`/${locale}/services`}
              className="group flex h-full min-h-[260px] flex-col justify-between rounded-[24px] p-6 text-white"
              style={{ background: "var(--warm-btn)", boxShadow: "0 18px 44px rgba(var(--warm-glow),0.32)" }}>
              <span className="self-end flex items-center justify-center w-12 h-12 rounded-full bg-white/20 transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight size={20} />
              </span>
              <div>
                <div className="font-display font-bold leading-none" style={{ fontSize: 56 }}>+{rest}</div>
                <div className="mt-2 font-semibold">{MORE[locale] ?? MORE.uz} — {viewAll}</div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
