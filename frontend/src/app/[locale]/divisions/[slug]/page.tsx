import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { mediaUrl } from "@/lib/utils";

type Props = { params: { locale: string; slug: string } };

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href={`/${locale}/divisions`}
        className="inline-flex items-center gap-2 text-content-muted hover:text-accent text-sm mb-8 transition-colors"
      >
        ← {t("title")}
      </Link>

      {/* Cover */}
      {div.cover_image && (
        <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-10">
          <Image
            src={mediaUrl(div.cover_image)}
            alt={div.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
          <div className="absolute bottom-6 left-6 flex items-center gap-4">
            {div.logo && (
              <div className="w-16 h-16 rounded-xl glass-card p-2 border border-white/20">
                <Image
                  src={mediaUrl(div.logo)}
                  alt={div.name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            )}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white drop-shadow">
              {div.name}
            </h1>
          </div>
        </div>
      )}

      {!div.cover_image && (
        <h1 className="font-display text-4xl font-bold text-content mb-6">{div.name}</h1>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2">
          {div.full_description && (
            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-content-secondary leading-relaxed text-lg whitespace-pre-line">
                {div.full_description}
              </p>
            </div>
          )}
          {!div.full_description && (
            <p className="text-content-secondary text-lg leading-relaxed mb-8">
              {div.short_description}
            </p>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {div.leader_name && (
            <div className="glass-card rounded-xl p-5 border border-border-subtle">
              <p className="text-content-muted text-xs uppercase tracking-wider mb-2">Rahbar</p>
              <p className="text-content font-semibold">{div.leader_name}</p>
              {div.leader_position && (
                <p className="text-content-secondary text-sm">{div.leader_position}</p>
              )}
            </div>
          )}
          <div className="glass-card rounded-xl p-5 border border-border-subtle space-y-3">
            <p className="text-content-muted text-xs uppercase tracking-wider mb-2">Aloqa</p>
            {div.contact_phone && (
              <a
                href={`tel:${div.contact_phone}`}
                className="flex items-center gap-2 text-content-secondary hover:text-accent text-sm transition-colors"
              >
                <span className="text-accent">✆</span> {div.contact_phone}
              </a>
            )}
            {div.contact_email && (
              <a
                href={`mailto:${div.contact_email}`}
                className="flex items-center gap-2 text-content-secondary hover:text-accent text-sm transition-colors"
              >
                <span className="text-accent">@</span> {div.contact_email}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
