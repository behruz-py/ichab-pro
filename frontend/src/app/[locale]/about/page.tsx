import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";

type Props = { params: { locale: string } };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("about") };
}

export default async function AboutPage({ params: { locale } }: Props) {
  setRequestLocale(locale);

  const [mission, vision, history] = await Promise.allSettled([
    api.pages.byKey("about_mission", locale),
    api.pages.byKey("about_vision", locale),
    api.pages.byKey("about_history", locale),
  ]);

  const pages = [mission, vision, history]
    .filter((r) => r.status === "fulfilled")
    .map((r) => (r as PromiseFulfilledResult<Awaited<ReturnType<typeof api.pages.byKey>>>).value);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-10">
        {pages.map((page) => (
          <div key={page.key} className="glass-card rounded-2xl border border-border-subtle p-8">
            <h2 className="font-display text-2xl font-bold text-content mb-4 flex items-center gap-3">
              <span className="w-1 h-7 bg-accent rounded-full" />
              {page.title}
            </h2>
            {page.subtitle && (
              <p className="text-content-secondary text-lg mb-4 leading-relaxed">{page.subtitle}</p>
            )}
            {page.image && (
              <div className="relative w-full rounded-xl overflow-hidden mb-6" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={page.image}
                  alt={page.title ?? ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 900px"
                />
              </div>
            )}
            {page.body && (
              <div className="text-content-secondary leading-relaxed whitespace-pre-line">{page.body}</div>
            )}
          </div>
        ))}

        {pages.length === 0 && (
          <div className="glass-card rounded-2xl border border-border-subtle p-12 text-center text-content-muted">
            <p className="text-4xl mb-4">🏭</p>
            <p>ICHAB — Ishlab chiqarishni avtomatlashtirish boshqarmasi</p>
          </div>
        )}
      </div>
    </div>
  );
}
