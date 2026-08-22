import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { HeroSection }       from "@/components/sections/HeroSection";
import { TrustStrip }        from "@/components/sections/TrustStrip";
import { StatsSection }      from "@/components/sections/StatsSection";
import { DivisionsPreview }  from "@/components/sections/DivisionsPreview";
import { ServicesPreview }   from "@/components/sections/ServicesPreview";
import { ProcessSection }    from "@/components/sections/ProcessSection";
import { PartnersMarquee }   from "@/components/sections/PartnersMarquee";
import { Reveal }            from "@/components/ui/Reveal";

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

  const stats     = statsRes.status     === "fulfilled" ? statsRes.value.results     : [];
  const divisions = divisionsRes.status === "fulfilled" ? divisionsRes.value.results : [];
  const services  = servicesRes.status  === "fulfilled" ? servicesRes.value.results  : [];
  const partners  = partnersRes.status  === "fulfilled" ? partnersRes.value.results  : [];

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

      {/* Trust strip — thin marquee bar */}
      <TrustStrip />

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
          viewAll={tServices("view_all")}
        />
      )}

      {/* How we work */}
      <ProcessSection locale={locale} />

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
            <div className="cta-flow-border">
              <div
                className="rounded-3xl p-12 relative overflow-hidden"
                style={{
                  background:           "var(--card-solid)",
                  backdropFilter:       "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                {/* Glow top */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(ellipse, rgba(var(--accent-rgb),0.14) 0%, transparent 70%)" }} />
                {/* Bottom glow */}
                <div className="absolute -bottom-10 left-1/4 w-[300px] h-[150px] rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(ellipse, rgba(var(--warm-glow),0.08) 0%, transparent 70%)" }} />

                <div className="relative">
                  <span className="inline-block text-xs font-bold uppercase tracking-[0.20em] mb-4" style={{ color: "var(--accent)" }}>
                    Biz bilan bog&apos;laning
                  </span>
                  <h2
                    className="font-display font-bold text-content mb-4"
                    style={{ fontSize: "clamp(26px, 3.5vw, 42px)" }}
                  >
                    {tHero("cta_primary")}?
                  </h2>
                  <p className="mb-10 max-w-lg mx-auto" style={{ color: "var(--content-secondary)" }}>
                    {tHero("subtitle")}
                  </p>
                  <Link
                    href={`/${locale}/contact`}
                    className="group btn-shine cta-pulse inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-semibold text-base text-white transition-transform duration-200 hover:scale-[1.04] hover:-translate-y-0.5"
                    style={{
                      background: "var(--warm-btn)",
                    }}
                  >
                    {tHero("cta_primary")}
                    <span className="inline-flex transition-transform duration-200 group-hover:translate-x-1">
                      <ArrowRight size={18} />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
