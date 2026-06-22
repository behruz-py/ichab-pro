import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Phone, Mail } from "lucide-react";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { mediaUrl } from "@/lib/utils";

type Props = { params: { locale: string; slug: string } };

export async function generateStaticParams() {
  const results: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const res = await api.divisions.list(locale).catch(() => null);
    if (res?.results) {
      res.results.forEach((d) => results.push({ locale, slug: d.slug }));
    }
  }
  return results;
}

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  const div = await api.divisions.detail(slug, locale).catch(() => null);
  if (!div) return {};
  return { title: div.name, description: div.short_description };
}

export default async function DivisionDetailPage({ params: { locale, slug } }: Props) {
  setRequestLocale(locale);

  const [t, div] = await Promise.all([
    getTranslations({ locale, namespace: "divisions" }),
    api.divisions.detail(slug, locale).catch(() => null),
  ]);

  if (!div) notFound();

  return (
    <div style={{ minHeight: "100vh" }}>

      {/* ── Cinematic hero ── */}
      <div className="relative" style={{ height: "clamp(320px, 45vh, 520px)" }}>
        {/* Background image or gradient */}
        {div.cover_image ? (
          <Image
            src={mediaUrl(div.cover_image)}
            alt={div.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: [
                "linear-gradient(135deg, rgba(29,78,216,0.22) 0%, rgba(14,165,233,0.10) 50%, rgba(5,10,23,1) 100%)",
                "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(59,130,246,0.04) 28px, rgba(59,130,246,0.04) 29px)",
                "repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(59,130,246,0.04) 28px, rgba(59,130,246,0.04) 29px)",
              ].join(", "),
            }}
          />
        )}

        {/* Multi-layer gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,10,23,0.30) 0%, rgba(5,10,23,0.55) 50%, rgba(5,10,23,0.97) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(5,10,23,0.50) 0%, transparent 60%)",
          }}
        />

        {/* Back link — top-left */}
        <div className="absolute top-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pt-6 max-w-7xl mx-auto">
          <Link
            href={`/${locale}/divisions`}
            className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:gap-3"
            style={{ color: "rgba(147,197,253,0.80)" }}
          >
            <ArrowLeft size={16} /> {t("title")}
          </Link>
        </div>

        {/* Bottom-left: lab badge + title */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl mx-auto">
          <div className="flex items-end gap-5">
            {/* Logo */}
            {div.logo && (
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 hidden sm:flex"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Image
                  src={mediaUrl(div.logo)}
                  alt={div.name}
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>
            )}

            <div>
              {/* LAB badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl mb-3"
                style={{
                  background: "rgba(5,10,23,0.82)",
                  border: "1px solid rgba(59,130,246,0.38)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full lab-active-dot" style={{ background: "#22C55E" }} />
                <span className="font-mono text-[11px] font-bold tracking-widest" style={{ color: "#60A5FA" }}>
                  LABORATORIYA · AKTIV
                </span>
              </div>
              <h1
                className="font-display font-bold text-white leading-tight"
                style={{ fontSize: "clamp(26px, 4vw, 48px)", textShadow: "0 2px 20px rgba(0,0,0,0.60)" }}
              >
                {div.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

          {/* Left: description */}
          <div>
            {/* Short description highlight */}
            <div
              className="rounded-2xl p-6 mb-8"
              style={{
                background: "rgba(9,18,42,0.70)",
                border: "1px solid rgba(59,130,246,0.16)",
                backdropFilter: "blur(16px)",
                borderLeft: "3px solid rgba(59,130,246,0.60)",
              }}
            >
              <p className="text-base leading-relaxed" style={{ color: "#C2D4EE", fontSize: "17px" }}>
                {div.short_description}
              </p>
            </div>

            {/* Full description */}
            {div.full_description && (
              <div
                className="rounded-2xl p-6 mb-8"
                style={{
                  background: "rgba(9,18,42,0.55)",
                  border: "1px solid rgba(59,130,246,0.10)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <p
                  className="text-sm leading-[1.85] whitespace-pre-line"
                  style={{ color: "#7B93B8" }}
                >
                  {div.full_description}
                </p>
              </div>
            )}

            {/* Back button */}
            <Link
              href={`/${locale}/divisions`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:gap-3"
              style={{
                background: "rgba(59,130,246,0.10)",
                border: "1px solid rgba(59,130,246,0.25)",
                color: "#60A5FA",
              }}
            >
              <ArrowLeft size={16} /> {t("title")}
            </Link>
          </div>

          {/* Right: glass sidebar */}
          <div className="space-y-4">

            {/* Leader card */}
            {div.leader_name && (
              <div
                className="rounded-2xl p-5 overflow-hidden relative"
                style={{
                  background: "rgba(9,18,42,0.80)",
                  border: "1px solid rgba(59,130,246,0.18)",
                  backdropFilter: "blur(18px)",
                }}
              >
                {/* Glow top */}
                <div
                  className="absolute top-0 inset-x-0 h-16 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)" }}
                />
                <div className="absolute top-0 inset-x-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.50) 50%, transparent)" }} />

                <p
                  className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4 relative"
                  style={{ color: "rgba(59,130,246,0.55)" }}
                >
                  Laboratoriya Rahbari
                </p>

                <div className="flex items-center gap-3 relative">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, rgba(29,78,216,0.35) 0%, rgba(59,130,246,0.20) 100%)",
                      border: "1px solid rgba(59,130,246,0.35)",
                      color: "#60A5FA",
                    }}
                  >
                    {div.leader_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: "#E2EAF4" }}>{div.leader_name}</p>
                    {div.leader_position && (
                      <p className="text-xs mt-0.5" style={{ color: "#5A7499" }}>{div.leader_position}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Contact card */}
            {(div.contact_phone || div.contact_email) && (
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(9,18,42,0.70)",
                  border: "1px solid rgba(59,130,246,0.14)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4"
                  style={{ color: "rgba(59,130,246,0.55)" }}
                >
                  Aloqa
                </p>

                <div className="space-y-3">
                  {div.contact_phone && (
                    <a
                      href={`tel:${div.contact_phone}`}
                      className="flex items-center gap-3 text-sm group transition-colors duration-200"
                      style={{ color: "#7B93B8" }}
                    >
                      <span
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105"
                        style={{
                          background: "rgba(59,130,246,0.12)",
                          border: "1px solid rgba(59,130,246,0.22)",
                          color: "#60A5FA",
                          fontSize: "14px",
                        }}
                      >
                        <Phone size={15} />
                      </span>
                      <span className="group-hover:text-blue-400 transition-colors duration-200">
                        {div.contact_phone}
                      </span>
                    </a>
                  )}
                  {div.contact_email && (
                    <a
                      href={`mailto:${div.contact_email}`}
                      className="flex items-center gap-3 text-sm group transition-colors duration-200"
                      style={{ color: "#7B93B8" }}
                    >
                      <span
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105"
                        style={{
                          background: "rgba(59,130,246,0.12)",
                          border: "1px solid rgba(59,130,246,0.22)",
                          color: "#60A5FA",
                          fontSize: "13px",
                        }}
                      >
                        <Mail size={14} />
                      </span>
                      <span className="group-hover:text-blue-400 transition-colors duration-200 truncate">
                        {div.contact_email}
                      </span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            <Link
              href={`/${locale}/contact`}
              className="flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-2xl font-semibold text-sm text-white transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)",
                boxShadow: "0 8px 32px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.16)",
              }}
            >
              Bog&apos;lanish <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
