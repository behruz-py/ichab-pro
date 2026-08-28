import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Settings, ArrowRight, FlaskConical, Cpu, Gauge, Activity, Cog, Zap, type LucideIcon } from "lucide-react";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { mediaUrl } from "@/lib/utils";

type Props = { params: { locale: string } };

const PLACEHOLDER_ICONS: LucideIcon[] = [FlaskConical, Cpu, Gauge, Activity, Cog, Zap];

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
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(var(--accent-rgb),0.12) 0%, transparent 65%)" }}
        />
        {/* Terminal scan lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.022,
            backgroundImage: "repeating-linear-gradient(0deg, rgba(var(--accent-rgb),1) 0px, transparent 1px, transparent 30px)",
          }}
        />
        <div
          className="absolute bottom-0 inset-x-0 h-px"
          style={{ background: "linear-gradient(90deg,transparent,rgba(var(--accent-rgb),0.28) 50%,transparent)" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "var(--accent)" }}>
                  Laboratoriyalar
                </span>
                {/* Pulsing green dot */}
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold font-mono"
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
              <p className="max-w-xl" style={{ fontSize: "18px", color: "var(--content-secondary)", lineHeight: "1.65" }}>
                {t("subtitle")}
              </p>
            </div>

            {/* Grid/list info */}
            <div
              className="inline-flex items-center gap-4 px-5 py-4 rounded-2xl flex-shrink-0"
              style={{
                background: "rgba(var(--panel-rgb),0.70)",
                border: "1px solid rgba(var(--accent-rgb),0.16)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="text-center">
                <p className="font-mono font-bold text-2xl" style={{ color: "var(--accent)" }}>{divisions.length}</p>
                <p className="text-[13px] uppercase tracking-wider" style={{ color: "#64748B" }}>Laboratoriya</p>
              </div>
              <div className="w-px h-10 self-center" style={{ background: "rgba(var(--accent-rgb),0.18)" }} />
              <div className="text-center">
                <p className="font-mono font-bold text-2xl" style={{ color: "#22C55E" }}>AKTIV</p>
                <p className="text-[13px] uppercase tracking-wider" style={{ color: "#64748B" }}>Status</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lab card grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {divisions.length === 0 ? (
          <div className="text-center py-24" style={{ color: "var(--content-muted)" }}>
            <Settings size={48} strokeWidth={1.5} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Laboratoriyalar hali qo&apos;shilmagan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {divisions.map((div, i) => {
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
                        style={{ background: "linear-gradient(135deg, rgba(var(--accent-rgb),0.12) 0%, rgba(var(--accent-rgb),0.03) 100%)" }}>
                        <Icon size={48} strokeWidth={1.3} style={{ color: "rgba(var(--accent-rgb),0.42)" }} />
                      </div>
                    )}

                    {/* LAB badge — light chip with status dot */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-lg"
                      style={{
                        background: "rgba(255,255,255,0.92)",
                        border: "1px solid rgba(var(--accent-rgb),0.25)",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                      }}>
                      <span className="w-1.5 h-1.5 rounded-full lab-active-dot" style={{ background: "#22C55E" }} />
                      <span className="font-mono text-[13px] font-bold tracking-widest" style={{ color: "var(--accent)" }}>
                        Laboratoriya · {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  {/* ── Body ── */}
                  <div className="flex flex-col flex-1 p-5">
                    <h2
                      className="font-display font-bold text-base leading-snug mb-2 line-clamp-2 first-letter:uppercase group-hover:text-[var(--accent)] transition-colors duration-200"
                      style={{ color: "var(--content)" }}
                    >
                      {div.name}
                    </h2>

                    {div.short_description && (
                      <p className="text-sm leading-relaxed line-clamp-2 mb-4 flex-1" style={{ color: "var(--content-secondary)" }}>
                        {div.short_description}
                      </p>
                    )}

                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold mt-auto transition-all duration-200 group-hover:gap-2.5"
                      style={{ color: "var(--accent)" }}
                    >
                      Batafsil <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
