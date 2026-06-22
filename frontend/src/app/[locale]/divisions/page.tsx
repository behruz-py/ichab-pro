import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Settings, ArrowRight } from "lucide-react";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { mediaUrl } from "@/lib/utils";

type Props = { params: { locale: string } };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "divisions" });
  return { title: t("title") };
}

export default async function DivisionsPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "divisions" });
  const res = await api.divisions.list(locale).catch(() => null);
  const divisions = res?.results ?? [];

  return (
    <div style={{ minHeight: "100vh" }}>

      {/* ── Hero header ── */}
      <div className="relative overflow-hidden" style={{ paddingTop: "110px", paddingBottom: "72px" }}>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(62,106,153,0.12) 0%, transparent 65%)" }}
        />
        {/* Terminal scan lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.022,
            backgroundImage: "repeating-linear-gradient(0deg, rgba(62,106,153,1) 0px, transparent 1px, transparent 30px)",
          }}
        />
        <div
          className="absolute bottom-0 inset-x-0 h-px"
          style={{ background: "linear-gradient(90deg,transparent,rgba(62,106,153,0.28) 50%,transparent)" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "#3E6A99" }}>
                  Laboratoriyalar
                </span>
                {/* Pulsing green dot */}
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono"
                  style={{
                    background: "rgba(34,197,94,0.08)",
                    border: "1px solid rgba(34,197,94,0.25)",
                    color: "#4ADE80",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full lab-active-dot" style={{ background: "#22C55E" }} />
                  {divisions.length} ONLINE
                </span>
              </div>

              <h1
                className="font-display font-bold text-content leading-tight mb-4"
                style={{ fontSize: "clamp(36px, 5vw, 60px)" }}
              >
                {t("title")}
              </h1>
              <p className="max-w-xl" style={{ fontSize: "18px", color: "#475569", lineHeight: "1.65" }}>
                {t("subtitle")}
              </p>
            </div>

            {/* Grid/list info */}
            <div
              className="inline-flex items-center gap-4 px-5 py-4 rounded-2xl flex-shrink-0"
              style={{
                background: "rgba(247,249,252,0.70)",
                border: "1px solid rgba(62,106,153,0.16)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="text-center">
                <p className="font-mono font-bold text-2xl" style={{ color: "#3E6A99" }}>{divisions.length}</p>
                <p className="text-[11px] uppercase tracking-wider" style={{ color: "#64748B" }}>Laboratoriya</p>
              </div>
              <div className="w-px h-10 self-center" style={{ background: "rgba(62,106,153,0.18)" }} />
              <div className="text-center">
                <p className="font-mono font-bold text-2xl" style={{ color: "#22C55E" }}>AKTIV</p>
                <p className="text-[11px] uppercase tracking-wider" style={{ color: "#64748B" }}>Status</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lab card grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {divisions.length === 0 ? (
          <div className="text-center py-24" style={{ color: "#94A3B8" }}>
            <Settings size={48} strokeWidth={1.5} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Laboratoriyalar hali qo&apos;shilmagan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {divisions.map((div, i) => (
              <Link
                key={div.id}
                href={`/${locale}/divisions/${div.slug}`}
                className="group relative block rounded-2xl overflow-hidden lab-card-scan"
                style={{
                  height: i === 0 ? "380px" : "320px",
                  border: "1px solid rgba(62,106,153,0.13)",
                }}
              >
                {/* Background */}
                <div className="absolute inset-0">
                  {div.cover_image ? (
                    <Image
                      src={mediaUrl(div.cover_image)}
                      alt={div.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                      priority={i < 3}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        backgroundImage: [
                          "linear-gradient(135deg, rgba(45,82,121,0.20) 0%, rgba(62,106,153,0.07) 50%, rgba(5,10,23,0.96) 100%)",
                          "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(62,106,153,0.04) 28px, rgba(62,106,153,0.04) 29px)",
                          "repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(62,106,153,0.04) 28px, rgba(62,106,153,0.04) 29px)",
                        ].join(", "),
                      }}
                    >
                      <Settings size={72} strokeWidth={1.2} style={{ opacity: 0.06 }} />
                    </div>
                  )}
                </div>

                {/* Dark gradient overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(5,10,23,0.10) 0%, rgba(5,10,23,0.45) 45%, rgba(5,10,23,0.92) 100%)",
                  }}
                />

                {/* Scan beam */}
                <div
                  className="lab-scan-beam absolute inset-x-0 h-[2px] pointer-events-none"
                  style={{
                    top: 0,
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(62,106,153,0) 5%, rgba(62,106,153,0.9) 40%, rgba(81,127,176,1) 50%, rgba(62,106,153,0.9) 60%, rgba(62,106,153,0) 95%, transparent 100%)",
                    boxShadow: "0 0 14px rgba(81,127,176,0.65)",
                  }}
                />

                {/* Top-left: LAB badge */}
                <div
                  className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl"
                  style={{
                    background: "rgba(5,10,23,0.82)",
                    border: "1px solid rgba(62,106,153,0.35)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full lab-active-dot" style={{ background: "#22C55E" }} />
                  <span className="font-mono text-[11px] font-bold tracking-widest" style={{ color: "#3E6A99" }}>
                    LAB · {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Top-right: logo */}
                {div.logo && (
                  <div
                    className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.10)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    <Image src={mediaUrl(div.logo)} alt={div.name} width={28} height={28} className="object-contain" />
                  </div>
                )}

                {/* Top border hover line */}
                <div
                  className="absolute top-0 inset-x-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, #2D5279, #3E6A99, #517FB0, #3E6A99, transparent)" }}
                />

                {/* Bottom content */}
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <h2
                    className="font-display font-bold text-lg leading-snug mb-1.5 group-hover:text-blue-300 transition-colors duration-200"
                    style={{ color: "#1E293B" }}
                  >
                    {div.name}
                  </h2>

                  <p className="text-sm line-clamp-2 mb-3" style={{ color: "rgba(194,212,238,0.65)" }}>
                    {div.short_description}
                  </p>

                  <div className="flex items-center justify-between">
                    {div.leader_name ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                          style={{
                            background: "rgba(62,106,153,0.25)",
                            border: "1px solid rgba(62,106,153,0.40)",
                            color: "#3E6A99",
                          }}
                        >
                          {div.leader_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs" style={{ color: "rgba(81,127,176,0.80)" }}>
                          {div.leader_name}
                        </span>
                      </div>
                    ) : (
                      <div />
                    )}

                    <span
                      className="inline-flex items-center gap-1 text-xs font-bold transition-all duration-200 group-hover:translate-x-1"
                      style={{ color: "#3E6A99" }}
                    >
                      Batafsil <ArrowRight size={13} />
                    </span>
                  </div>
                </div>

                {/* Hover glow ring */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(62,106,153,0.45), 0 12px 48px rgba(62,106,153,0.15)" }}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
