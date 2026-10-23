import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { ServiceGroups } from "@/components/sections/ServiceGroups";

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
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 title-sheen inline-block pb-1">{t("title")}</h1>
        <p className="text-content-secondary text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>

      <ServiceGroups services={services} locale={locale} />
    </div>
  );
}
