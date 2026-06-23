"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, Gauge, Activity, FlaskConical, Cog, Zap, type LucideIcon } from "lucide-react";
import type { Division } from "@/types/api";
import { mediaUrl } from "@/lib/utils";
import { fadeLeft, VIEWPORT } from "@/lib/motion";

interface Props {
  divisions: Division[];
  locale: string;
  title: string;
  subtitle: string;
  viewAll: string;
  viewDetail: string;
}

const PLACEHOLDER_ICONS: LucideIcon[] = [FlaskConical, Cpu, Gauge, Activity, Cog, Zap];

export function DivisionsPreview({ divisions, locale, title, subtitle, viewAll, viewDetail }: Props) {
  const shown = divisions.slice(0, 6);
  if (!shown.length) return null;

  return (
    <section className="relative py-20">
      <div className="absolute inset-0 pointer-events-none" style={{
        opacity: 0.018,
        backgroundImage:
          "repeating-linear-gradient(0deg,rgba(47,94,148,1) 0px,transparent 1px,transparent 38px)," +
          "repeating-linear-gradient(90deg,rgba(47,94,148,1) 0px,transparent 1px,transparent 38px)",
      }} />
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(47,94,148,0.22) 50%,transparent)" }} />
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(47,94,148,0.12) 50%,transparent)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-5">
          <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: "#2F5E94" }}>
              Bo&apos;linmalar
            </span>
            <h2 className="font-display font-bold text-content leading-tight" style={{ fontSize: "clamp(28px,3.5vw,44px)" }}>
              {title}
            </h2>
            <p className="mt-3 max-w-lg" style={{ color: "#475569" }}>{subtitle}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5, delay: 0.2 }}>
            <Link
              href={`/${locale}/divisions`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-all duration-200 hover:gap-3"
              style={{ background: "rgba(47,94,148,0.10)", border: "1px solid rgba(47,94,148,0.25)", color: "#2F5E94" }}
            >
              {viewAll} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Card grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {shown.map((div, i) => {
            const Icon = PLACEHOLDER_ICONS[i % PLACEHOLDER_ICONS.length];
            return (
              <Link
                key={div.id}
                href={`/${locale}/divisions/${div.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--glass-border)",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                {/* ── Image / placeholder — 16:9 ── */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  {div.cover_image ? (
                    <Image
                      src={mediaUrl(div.cover_image)}
                      alt={div.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                      priority={i < 3}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, rgba(47,94,148,0.12) 0%, rgba(47,94,148,0.03) 100%)" }}>
                      <Icon size={46} strokeWidth={1.3} style={{ color: "rgba(47,94,148,0.42)" }} />
                    </div>
                  )}

                  {/* LAB badge — light chip, readable on photo or placeholder */}
                  <span className="absolute top-3 left-3 font-mono text-[11px] font-bold tracking-widest px-2.5 py-1 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.92)",
                      border: "1px solid rgba(47,94,148,0.25)",
                      color: "#2F5E94",
                      backdropFilter: "blur(6px)",
                      WebkitBackdropFilter: "blur(6px)",
                    }}>
                    LAB · {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* ── Body ── */}
                <div className="flex flex-col flex-1 p-4">
                  <h3
                    className="font-display font-semibold text-sm leading-snug mb-3 flex-1 line-clamp-2 first-letter:uppercase group-hover:text-[#2F5E94] transition-colors duration-200"
                    style={{ color: "#1E293B" }}
                  >
                    {div.name}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2 transition-all duration-200"
                    style={{ color: "#2F5E94" }}>
                    {viewDetail} <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
