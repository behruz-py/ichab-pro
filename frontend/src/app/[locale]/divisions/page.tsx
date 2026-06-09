import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { mediaUrl } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { StaggerGrid, StaggerItem } from "@/components/ui/StaggerGrid";
import { TiltCard } from "@/components/ui/TiltCard";

type Props = { params: { locale: string } };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "divisions" });
  return { title: t("title") };
}

export default async function DivisionsPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "divisions" });
  const res = await api.divisions.list(locale).catch(() => null);
  const divisions = res?.results ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Reveal className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-content mb-4">{t("title")}</h1>
        <p className="text-content-secondary text-lg max-w-2xl">{t("subtitle")}</p>
      </Reveal>

      <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {divisions.map((div) => (
          <StaggerItem key={div.id}>
            <TiltCard className="h-full">
              <Link
                href={`/${locale}/divisions/${div.slug}`}
                className="group glass-card rounded-2xl overflow-hidden border border-border-subtle hover:border-accent/40 transition-all duration-300 hover:shadow-glow block h-full"
              >
                <div className="relative h-52 bg-surface-secondary overflow-hidden">
                  {div.cover_image ? (
                    <Image
                      src={mediaUrl(div.cover_image)}
                      alt={div.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-transparent">
                      <span className="text-5xl text-accent/30">⚙</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="font-display font-bold text-content text-xl mb-3 group-hover:text-accent transition-colors">
                    {div.name}
                  </h2>
                  <p className="text-content-secondary text-sm leading-relaxed line-clamp-3 mb-4">
                    {div.short_description}
                  </p>
                  {(div.leader_name || div.contact_phone) && (
                    <div className="pt-4 border-t border-border-subtle text-xs text-content-muted space-y-1">
                      {div.leader_name && <p>👤 {div.leader_name}</p>}
                      {div.contact_phone && <p>📞 {div.contact_phone}</p>}
                    </div>
                  )}
                </div>
              </Link>
            </TiltCard>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </div>
  );
}
