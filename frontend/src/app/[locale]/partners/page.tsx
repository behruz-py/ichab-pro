import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Star } from "lucide-react";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { PartnerGrid } from "@/components/sections/PartnerGrid";
import { BRAND_NAME } from "@/lib/site";

const TRUSTED_PARTNERS: Record<string, string> = {
  uz: "ta ishonchli hamkor",
  ru: "надёжных партнёров",
  en: "trusted partners",
};

// Refresh every 60s — ensures admin changes appear quickly on the next request
export const revalidate = 60;

type Props = { params: { locale: string } };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "partners" });
  return { title: t("title") };
}

export default async function PartnersPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "partners" });

  const res = await api.partners.list(undefined, locale).catch(() => null);
  const partners = res?.results ?? [];
  const featuredCount = partners.filter((p) => p.is_featured).length;

  return (
    <div style={{ minHeight: "100vh" }}>

      {/* ── Hero header ── */}
      <div className="relative overflow-hidden" style={{ paddingTop: "110px", paddingBottom: "72px" }}>
        {/* Ambient radial glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(var(--accent-rgb),0.12) 0%, transparent 65%)" }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.03,
            backgroundImage:
              "linear-gradient(rgba(var(--accent-rgb),1) 1px,transparent 1px),linear-gradient(90deg,rgba(var(--accent-rgb),1) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Bottom separator */}
        <div
          className="absolute bottom-0 inset-x-0 h-px"
          style={{ background: "linear-gradient(90deg,transparent,rgba(var(--accent-rgb),0.28) 50%,transparent)" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.22em] mb-5"
            style={{ color: "var(--accent)" }}
          >
            {t("badge")}
          </span>

          <h1
            className="font-display font-bold text-content mb-5 leading-tight"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            {t("title")}
          </h1>

          <p
            className="max-w-2xl mx-auto mb-10"
            style={{ fontSize: "18px", color: "var(--content-secondary)", lineHeight: "1.65" }}
          >
            {t("subtitle")}
          </p>

          {/* Stats chips */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{
                background: "rgba(var(--accent-rgb),0.10)",
                border: "1px solid rgba(var(--accent-rgb),0.25)",
                color: "var(--accent)",
              }}
            >
              <span className="font-bold text-white" style={{ fontSize: "20px" }}>{partners.length}</span>
              {t("all_count")}
            </div>

            {featuredCount > 0 && (
              <div
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: "rgba(var(--warm-glow),0.08)",
                  border: "1px solid rgba(var(--warm-glow),0.25)",
                  color: "var(--warm-solid)",
                }}
              >
                <Star size={16} fill="var(--warm-solid)" />
                <span className="font-bold text-white" style={{ fontSize: "20px" }}>{featuredCount}</span>
                {t("strategic")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Partner grid (client component for hover effects) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PartnerGrid partners={partners} visitSite={t("visit_site")} />
      </div>

      {/* ── Bottom trust bar ── */}
      {partners.length > 0 && (
        <div
          className="py-12"
          style={{ borderTop: "1px solid rgba(var(--accent-rgb),0.10)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p
              style={{
                color: "var(--content-muted)",
                fontSize: "12px",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {partners.length} {TRUSTED_PARTNERS[locale] ?? TRUSTED_PARTNERS.uz} · {BRAND_NAME[locale] ?? BRAND_NAME.uz}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
