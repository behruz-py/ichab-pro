"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

function PlaceholderBg({ index }: { index: number }) {
  const gradients = [
    "radial-gradient(circle at 30% 40%, rgba(36,76,119,0.40) 0%, rgba(5,9,24,0.98) 65%)",
    "radial-gradient(circle at 70% 30%, rgba(47,94,148,0.30) 0%, rgba(5,9,24,0.98) 65%)",
    "radial-gradient(circle at 50% 70%, rgba(47,94,148,0.28) 0%, rgba(5,9,24,0.98) 65%)",
    "radial-gradient(circle at 20% 60%, rgba(47,94,148,0.28) 0%, rgba(5,9,24,0.98) 65%)",
    "radial-gradient(circle at 80% 50%, rgba(47,94,148,0.28) 0%, rgba(5,9,24,0.98) 65%)",
  ];
  return <div className="absolute inset-0" style={{ background: gradients[index % gradients.length] }} />;
}

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
          {shown.map((div, i) => (
            <Link
              key={div.id}
              href={`/${locale}/divisions/${div.slug}`}
              className="group relative block rounded-2xl overflow-hidden"
              style={{
                aspectRatio: "16/9",
                border: "1px solid rgba(47,94,148,0.16)",
              }}
            >
              {/* ── Image — fills 16:9 card exactly, zero crop ── */}
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
                <PlaceholderBg index={i} />
              )}

              {/* ── Bottom blur + dark fade — one seamless layer ── */}
              <div className="absolute inset-x-0 bottom-0" style={{ height: "70%" }}>
                <div className="absolute inset-0" style={{
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  maskImage: "linear-gradient(to bottom, transparent 0%, black 55%)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 55%)",
                }} />
                <div className="absolute inset-0" style={{
                  background: "linear-gradient(to bottom, transparent 0%, rgba(3,8,20,0.65) 40%, rgba(3,8,20,0.96) 75%, rgba(3,8,20,1) 100%)",
                }} />
              </div>

              {/* ── Top vignette for badge ── */}
              <div className="absolute inset-x-0 top-0 h-16 pointer-events-none" style={{
                background: "linear-gradient(to bottom, rgba(3,8,20,0.60) 0%, transparent 100%)",
              }} />

              {/* ── Hover top accent line ── */}
              <div className="absolute top-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, #2F5E94 30%, #3D72AD 50%, #2F5E94 70%, transparent)" }} />

              {/* ── LAB badge + logo ── */}
              <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                <span className="font-mono text-[11px] font-bold tracking-widest px-2.5 py-1 rounded-lg"
                  style={{
                    background: "rgba(3,8,20,0.75)",
                    border: "1px solid rgba(47,94,148,0.45)",
                    color: "#2F5E94",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}>
                  LAB · {String(i + 1).padStart(2, "0")}
                </span>
                {div.logo && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.14)",
                      border: "1px solid rgba(255,255,255,0.22)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                    }}>
                    <Image src={mediaUrl(div.logo)} alt={div.name} width={18} height={18} className="object-contain" />
                  </div>
                )}
              </div>

              {/* ── Bottom text ── */}
              <div className="absolute bottom-0 inset-x-0 px-4 pb-4 pt-2 z-10">
                <h3
                  className="font-display font-bold leading-snug mb-1.5 group-hover:text-[#244C77] transition-colors duration-200 line-clamp-2"
                  style={{
                    color: "#F0F6FF",
                    fontSize: "15px",
                    textShadow: "0 2px 10px rgba(0,0,0,0.80)",
                  }}
                >
                  {div.name}
                </h3>
                <div className="flex items-center justify-between">
                  {div.leader_name ? (
                    <p className="text-xs" style={{ color: "rgba(61,114,173,0.75)" }}>
                      {div.leader_name}
                    </p>
                  ) : <span />}
                  <span className="inline-flex items-center gap-1 text-xs font-bold transition-all duration-200 group-hover:translate-x-0.5"
                    style={{ color: "#2F5E94" }}>
                    {viewDetail} <ArrowRight size={13} />
                  </span>
                </div>
              </div>

              {/* ── Hover glow ring ── */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: "inset 0 0 0 1px rgba(47,94,148,0.52)" }} />
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
