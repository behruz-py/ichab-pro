import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { mediaUrl } from "@/lib/utils";

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-content mb-4">{t("title")}</h1>
        <p className="text-content-secondary text-lg max-w-2xl">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((svc) => (
          <Link
            key={svc.id}
            href={`/${locale}/services/${svc.slug}`}
            className="group glass-card rounded-2xl border border-border-subtle overflow-hidden hover:border-accent/40 transition-all duration-300 hover:shadow-glow flex flex-col"
          >
            {svc.cover_image ? (
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={mediaUrl(svc.cover_image)}
                  alt={svc.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ) : (
              <div className="h-20 flex items-end px-6 pt-6">
                {svc.icon && <span className="text-4xl">{svc.icon}</span>}
              </div>
            )}
            <div className="p-6 flex-1 flex flex-col">
              {!svc.cover_image && !svc.icon && null}
              <h2 className="font-display font-semibold text-content text-lg mb-2 group-hover:text-accent transition-colors">
                {svc.name}
              </h2>
              <p className="text-content-secondary text-sm leading-relaxed line-clamp-3 flex-1">
                {svc.short_description}
              </p>
              {svc.price_from && (
                <p className="text-accent text-sm font-medium mt-3">{svc.price_from}</p>
              )}
              <span className="inline-flex items-center gap-1 mt-4 text-accent text-xs font-medium">
                {t("learn_more")}
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
