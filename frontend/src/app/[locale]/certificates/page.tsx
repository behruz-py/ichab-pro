import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Award } from "lucide-react";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { CertificateGrid } from "@/components/sections/CertificateGrid";

type Props = { params: { locale: string } };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "certificates" });
  return { title: t("title") };
}

export default async function CertificatesPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "certificates" });

  const res = await api.certificates.list(locale).catch(() => null);
  const certs = res?.results ?? [];

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
            <Award size={14} /> {t("international")} · {t("national")}
          </span>

          <h1
            className="font-display font-bold text-content mb-5 leading-tight"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            {t("title")}
          </h1>

          <p
            className="max-w-2xl mx-auto"
            style={{ fontSize: "18px", color: "var(--content-secondary)", lineHeight: "1.65" }}
          >
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* ── Certificate grid (client component for filter + motion) ── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <CertificateGrid certs={certs} locale={locale} international={t("international")} national={t("national")} />
      </div>
    </div>
  );
}
