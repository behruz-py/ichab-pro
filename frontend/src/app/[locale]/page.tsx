import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { DivisionsPreview } from "@/components/sections/DivisionsPreview";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { PartnersMarquee } from "@/components/sections/PartnersMarquee";
import { Reveal } from "@/components/ui/Reveal";

type Props = { params: { locale: string } };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "hero" });
  return {
    title: `${t("title")} ${t("title_accent")}`,
    description: t("subtitle"),
  };
}

export default async function HomePage({ params: { locale } }: Props) {
  setRequestLocale(locale);

  const [tHero, tStats, tDivisions, tServices, tPartners] = await Promise.all([
    getTranslations({ locale, namespace: "hero" }),
    getTranslations({ locale, namespace: "stats" }),
    getTranslations({ locale, namespace: "divisions" }),
    getTranslations({ locale, namespace: "services" }),
    getTranslations({ locale, namespace: "partners" }),
  ]);

  const [statsRes, divisionsRes, servicesRes, partnersRes] = await Promise.allSettled([
    api.stats.list(locale),
    api.divisions.list(locale),
    api.services.list(locale),
    api.partners.list(true, locale),
  ]);

  const stats = statsRes.status === "fulfilled" ? statsRes.value.results : [];
  const divisions = divisionsRes.status === "fulfilled" ? divisionsRes.value.results : [];
  const services = servicesRes.status === "fulfilled" ? servicesRes.value.results : [];
  const partners = partnersRes.status === "fulfilled" ? partnersRes.value.results : [];

  return (
    <>
      <HeroSection
        locale={locale}
        badge={tHero("badge")}
        title={tHero("title")}
        titleAccent={tHero("title_accent")}
        subtitle={tHero("subtitle")}
        ctaPrimary={tHero("cta_primary")}
        ctaSecondary={tHero("cta_secondary")}
        scrollHint={tHero("scroll_hint")}
      />

      {stats.length > 0 && (
        <StatsSection stats={stats} title={tStats("title")} />
      )}

      {divisions.length > 0 && (
        <DivisionsPreview
          divisions={divisions}
          locale={locale}
          title={tDivisions("title")}
          subtitle={tDivisions("subtitle")}
          viewAll={tDivisions("view_all")}
          viewDetail={tDivisions("view_detail")}
        />
      )}

      {services.length > 0 && (
        <ServicesPreview
          services={services}
          locale={locale}
          title={tServices("title")}
          subtitle={tServices("subtitle")}
          learnMore={tServices("learn_more")}
        />
      )}

      {partners.length > 0 && (
        <PartnersMarquee
          partners={partners}
          title={tPartners("title")}
          subtitle={tPartners("subtitle")}
        />
      )}

      {/* CTA Banner */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal variant="scale">
            <div className="glass-card rounded-3xl border border-accent/20 p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent-secondary/5 rounded-3xl" />
              <div className="relative">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-content mb-4">
                  {tHero("cta_primary")}?
                </h2>
                <p className="text-content-secondary mb-8 max-w-lg mx-auto">
                  {tHero("subtitle")}
                </p>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex px-10 py-4 rounded-xl bg-accent text-surface font-semibold text-lg shadow-glow hover:opacity-90 transition-all hover:scale-[1.02]"
                >
                  {tHero("cta_primary")}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
