import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { mediaUrl, formatDate } from "@/lib/utils";

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

  const international = certs.filter((c) => c.is_international);
  const national = certs.filter((c) => !c.is_international);

  const CertGroup = ({ items, label }: { items: typeof certs; label: string }) => (
    <div className="mb-14">
      <h2 className="font-display text-2xl font-bold text-content mb-6 flex items-center gap-3">
        <span className="w-1 h-7 bg-accent rounded-full" />
        {label}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((cert) => (
          <div
            key={cert.id}
            className="group glass-card rounded-2xl border border-border-subtle overflow-hidden hover:border-accent/40 transition-all duration-300 hover:shadow-glow"
          >
            {cert.image && (
              <div className="relative h-44 bg-surface-secondary overflow-hidden">
                <Image
                  src={mediaUrl(cert.image)}
                  alt={cert.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
              </div>
            )}
            <div className="p-5">
              <h3 className="font-display font-semibold text-content mb-1 text-sm">{cert.name}</h3>
              <p className="text-content-muted text-xs mb-3">{cert.issuing_organization}</p>
              {cert.issued_date && (
                <p className="text-content-secondary text-xs">
                  {formatDate(cert.issued_date, locale)}
                  {cert.expiry_date && ` — ${formatDate(cert.expiry_date, locale)}`}
                </p>
              )}
              {cert.document && (
                <a
                  href={mediaUrl(cert.document)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-accent text-xs font-medium hover:underline"
                >
                  📄 PDF
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-content mb-4">{t("title")}</h1>
        <p className="text-content-secondary text-lg max-w-2xl">{t("subtitle")}</p>
      </div>

      {international.length > 0 && <CertGroup items={international} label={t("international")} />}
      {national.length > 0 && <CertGroup items={national} label={t("national")} />}
    </div>
  );
}
