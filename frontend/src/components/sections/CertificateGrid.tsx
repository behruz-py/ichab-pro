"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Award, ShieldCheck, FileText, FileX2 } from "lucide-react";
import type { Certificate } from "@/types/api";
import { mediaUrl, formatDate } from "@/lib/utils";
import { staggerContainer, fadeUp, VIEWPORT } from "@/lib/motion";

type Loc = Record<string, string>;
const EMPTY: Loc = { uz: "Sertifikatlar hali qo'shilmagan", ru: "Сертификаты пока не добавлены", en: "No certificates yet" };
const ALL: Loc = { uz: "Barchasi", ru: "Все", en: "All" };

interface Props {
  certs: Certificate[];
  locale: string;
  international: string;
  national: string;
}

export function CertificateGrid({ certs, locale, international, national }: Props) {
  const [filter, setFilter] = useState<"all" | "intl" | "nat">("all");

  const intlCount = certs.filter((c) => c.is_international).length;
  const natCount = certs.length - intlCount;

  const shown = useMemo(() => {
    if (filter === "intl") return certs.filter((c) => c.is_international);
    if (filter === "nat") return certs.filter((c) => !c.is_international);
    return certs;
  }, [certs, filter]);

  if (certs.length === 0) {
    return (
      <div className="text-center py-24" style={{ color: "var(--content-muted)" }}>
        <FileX2 size={56} strokeWidth={1.5} style={{ margin: "0 auto 20px", opacity: 0.4 }} />
        <p className="text-lg font-medium">{EMPTY[locale] ?? EMPTY.uz}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2.5 mb-10">
        <button onClick={() => setFilter("all")} className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={filter === "all"
            ? { background: "var(--accent)", color: "#fff", boxShadow: "0 0 16px rgba(var(--accent-rgb),0.4)" }
            : { background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--content-secondary)" }}>
          {ALL[locale] ?? ALL.uz} · {certs.length}
        </button>
        {intlCount > 0 && (
          <button onClick={() => setFilter("intl")} className="px-4 py-2 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2"
            style={filter === "intl"
              ? { background: "rgb(56,189,248)", color: "#0b1b33", boxShadow: "0 0 16px rgba(56,189,248,0.4)" }
              : { background: "var(--glass)", border: "1px solid rgba(56,189,248,0.3)", color: "var(--content-secondary)" }}>
            <Award size={15} /> {international} · {intlCount}
          </button>
        )}
        {natCount > 0 && (
          <button onClick={() => setFilter("nat")} className="px-4 py-2 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2"
            style={filter === "nat"
              ? { background: "rgb(16,185,129)", color: "#0b1b33", boxShadow: "0 0 16px rgba(16,185,129,0.4)" }
              : { background: "var(--glass)", border: "1px solid rgba(16,185,129,0.3)", color: "var(--content-secondary)" }}>
            <ShieldCheck size={15} /> {national} · {natCount}
          </button>
        )}
      </div>

      {/* Grid */}
      <motion.div
        key={filter}
        variants={staggerContainer} initial="hidden" animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {shown.map((cert) => (
          <motion.div key={cert.id} variants={fadeUp} viewport={VIEWPORT}>
            <CertCard cert={cert} locale={locale} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function CertCard({ cert, locale }: { cert: Certificate; locale: string }) {
  const rgb = cert.is_international ? "56,189,248" : "16,185,129";
  const Icon = cert.is_international ? Award : ShieldCheck;

  return (
    <div
      className="group relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
      style={{ background: "var(--card-bg)", border: `1px solid rgba(${rgb},0.22)`, boxShadow: "var(--card-shadow)" }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1.5px rgba(${rgb},0.5), 0 16px 40px rgba(${rgb},0.20)` }} />

      <div className="relative flex items-center justify-center overflow-hidden flex-shrink-0"
        style={{ background: "#fff", height: 160 }}>
        {cert.image ? (
          <Image
            src={mediaUrl(cert.image)}
            alt={cert.name}
            fill
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 100vw, (max-width:1024px) 50vw, 25vw"
          />
        ) : (
          <Icon size={56} strokeWidth={1.3} style={{ color: `rgb(${rgb})`, opacity: 0.35 }} />
        )}
        <span className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
          style={{ background: `rgba(${rgb},0.95)`, color: "#fff" }}>
          <Icon size={12} />
          <span className="font-mono text-[11px] font-bold tracking-wide uppercase">
            {cert.is_international ? "INTL" : "NAT"}
          </span>
        </span>
      </div>

      <div className="relative flex flex-col flex-1 p-5">
        <h3 className="font-display font-bold leading-snug mb-1.5" style={{ fontSize: 15, color: "var(--content)" }}>
          {cert.name}
        </h3>
        <p className="text-xs mb-3" style={{ color: "var(--content-muted)" }}>{cert.issuing_organization}</p>

        {cert.issued_date && (
          <p className="text-xs mt-auto pt-3" style={{ color: "var(--content-secondary)", borderTop: "1px solid var(--border)" }}>
            {formatDate(cert.issued_date, locale)}
            {cert.expiry_date && ` — ${formatDate(cert.expiry_date, locale)}`}
          </p>
        )}

        {cert.document && (
          <a
            href={mediaUrl(cert.document)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold hover:underline"
            style={{ color: `rgb(${rgb})` }}
          >
            <FileText size={14} /> PDF
          </a>
        )}
      </div>
    </div>
  );
}
