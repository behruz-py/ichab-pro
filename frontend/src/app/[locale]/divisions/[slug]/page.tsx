import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { mediaUrl } from "@/lib/utils";
import { LabShowcase } from "./_LabShowcase";

type Props = { params: { locale: string; slug: string } };

export async function generateStaticParams() {
  const results: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const res = await api.divisions.list(locale).catch(() => null);
    if (res?.results) res.results.forEach((d) => results.push({ locale, slug: d.slug }));
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
    <LabShowcase
      lab={{
        name: div.name,
        shortDescription: div.short_description ?? "",
        fullDescription: div.full_description ?? "",
        coverImage: div.cover_image ? mediaUrl(div.cover_image) : null,
        logo: div.logo ? mediaUrl(div.logo) : null,
        leaderName: div.leader_name ?? "",
        leaderPosition: div.leader_position ?? "",
        contactPhone: div.contact_phone ?? "",
        contactEmail: div.contact_email ?? "",
      }}
      locale={locale}
      backLabel={t("title")}
    />
  );
}
