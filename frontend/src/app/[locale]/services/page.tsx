import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Cog } from "lucide-react";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { ServiceGroups } from "@/components/sections/ServiceGroups";

const BADGE: Record<string, string> = { uz: "Xizmatlar", ru: "Услуги", en: "Services" };
const SERVICE_LABEL: Record<string, string> = { uz: "Xizmat", ru: "Услуга", en: "Service" };
const GROUP_LABEL: Record<string, string> = { uz: "Yo'nalish", ru: "Направление", en: "Direction" };

type Props = { params: { locale: string } };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "services" });
  return { title: t("title") };
}

export default async function ServicesPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

  const res = await api.services.list(locale).catch(() => null);
  const services = res?.results ?? [];
  const groupCount = new Set(services.map((s) => s.division ?? "other")).size;

  return (
    <div style={{ minHeight: "100vh" }}>

      {/* ── Hero header ── */}
      <div className="relative overflow-hidden" style={{ paddingTop: "110px", paddingBottom: "72px" }}>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(var(--accent-rgb),0.12) 0%, transparent 65%)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.03,
            backgroundImage:
              "linear-gradient(rgba(var(--accent-rgb),1) 1px,transparent 1px),linear-gradient(90deg,rgba(var(--accent-rgb),1) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute bottom-0 inset-x-0 h-px"
          style={{ background: "linear-gradient(90deg,transparent,rgba(var(--accent-rgb),0.28) 50%,transparent)" }}
        />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] mb-5"
            style={{ color: "var(--accent)" }}
          >
            <Cog size={14} /> {BADGE[locale] ?? BADGE.uz}
          </span>

          <h1
            className="font-display font-bold text-content mb-5 leading-tight title-sheen"
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

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{
                background: "rgba(var(--accent-rgb),0.10)",
                border: "1px solid rgba(var(--accent-rgb),0.25)",
                color: "var(--accent)",
              }}
            >
              <span className="font-bold" style={{ fontSize: "20px", color: "var(--accent)" }}>{services.length}</span>
              {SERVICE_LABEL[locale] ?? SERVICE_LABEL.uz}
            </div>
            {groupCount > 0 && (
              <div
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: "rgba(var(--warm-glow),0.08)",
                  border: "1px solid rgba(var(--warm-glow),0.25)",
                  color: "var(--warm-solid)",
                }}
              >
                <span className="font-bold" style={{ fontSize: "20px", color: "var(--warm-solid)" }}>{groupCount}</span>
                {GROUP_LABEL[locale] ?? GROUP_LABEL.uz}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <ServiceGroups services={services} locale={locale} />
      </div>
    </div>
  );
}
