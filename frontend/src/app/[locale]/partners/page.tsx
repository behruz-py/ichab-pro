import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { mediaUrl } from "@/lib/utils";

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-content mb-4">{t("title")}</h1>
        <p className="text-content-secondary text-lg max-w-2xl">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="group glass-card rounded-2xl border border-border-subtle p-6 flex flex-col items-center text-center hover:border-accent/40 transition-all duration-300 hover:shadow-glow"
          >
            {partner.logo ? (
              <div className="w-20 h-16 flex items-center justify-center mb-3">
                <Image
                  src={mediaUrl(partner.logo)}
                  alt={partner.name}
                  width={80}
                  height={60}
                  className="object-contain max-h-14 opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </div>
            ) : (
              <div className="w-20 h-16 flex items-center justify-center mb-3 text-3xl text-accent/40">🏢</div>
            )}
            <p className="text-content-secondary text-xs font-medium">{partner.name}</p>
            {partner.website && (
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-accent text-xs hover:underline"
              >
                {t("visit_site")} →
              </a>
            )}
            {partner.is_featured && (
              <span className="mt-2 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">★</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
