import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { SectionLabel } from "@/components/editorial/SectionLabel";
import { FinaleCta } from "@/components/editorial/FinaleCta";
import { TechnologyWall, IndustryList } from "@/components/partners/PartnersShowcase";

// Refresh every 60s so admin changes appear quickly.
export const revalidate = 60;

type Props = { params: { locale: string } };
type Loc = Record<string, string>;

const EYEBROW: Loc = { uz: "Hamkorlar", ru: "Партнёры", en: "Partners" };
const K_ALL: Loc = { uz: "Hamkor", ru: "Партнёров", en: "Partners" };
const K_TECH: Loc = { uz: "Texnologik hamkor", ru: "Технологических", en: "Technology partners" };
const K_IND: Loc = { uz: "Sanoat hamkori", ru: "Промышленных", en: "Industrial partners" };
const K_COUNTRY: Loc = { uz: "Mamlakat", ru: "Стран", en: "Countries" };

const TECH_TITLE: Loc = { uz: "Texnologik hamkorlar", ru: "Технологические партнёры", en: "Technology partners" };
const TECH_TEXT: Loc = {
  uz: "Avtomatlashtirish, o'lchov va elektrotexnika sohasidagi jahon ishlab chiqaruvchilari — loyihalarimizda qo'llanadigan uskunalar va asboblar.",
  ru: "Мировые производители в области автоматизации, измерений и электротехники — оборудование и приборы, применяемые в наших проектах.",
  en: "Global manufacturers of automation, measurement and electrical equipment — the hardware and instruments used in our projects.",
};
const IND_TITLE: Loc = { uz: "Sanoat hamkorlari", ru: "Промышленные партнёры", en: "Industrial partners" };
const IND_TEXT: Loc = {
  uz: "Hududning yirik sanoat korxonalari va tashkilotlari bilan hamkorlik.",
  ru: "Сотрудничество с крупными промышленными предприятиями и организациями региона.",
  en: "Cooperation with the region's major industrial companies and organisations.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "partners" });
  return { title: t("title") };
}

function SectionHead({ index, label, title, text }: { index: number; label: string; title: string; text: string }) {
  return (
    <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-end mb-12 sm:mb-16">
      <div className="lg:col-span-7">
        <SectionLabel index={index} label={label} />
        <h2 className="font-display font-bold leading-[1.05] tracking-[-0.02em]" style={{ fontSize: "clamp(32px,4vw,64px)", color: "var(--content)" }}>{title}</h2>
      </div>
      <p className="lg:col-span-5 leading-relaxed" style={{ fontSize: "clamp(15px,1.2vw,18px)", color: "var(--content-secondary)" }}>{text}</p>
    </div>
  );
}

export default async function PartnersPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "partners" });
  const tr = (o: Loc) => o[locale] ?? o.uz;

  const res = await api.partners.list(undefined, locale).catch(() => null);
  const partners = res?.results ?? [];
  const industry = partners.filter((p) => p.kind === "industry");
  const technology = partners.filter((p) => p.kind !== "industry");
  const countries = new Set(partners.map((p) => p.country).filter(Boolean)).size;

  const kpis: [number, string][] = [[partners.length, tr(K_ALL)]];
  if (technology.length && industry.length) kpis.push([technology.length, tr(K_TECH)], [industry.length, tr(K_IND)]);
  if (countries > 1) kpis.push([countries, tr(K_COUNTRY)]);

  let section = 1;
  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-[560px] pointer-events-none" aria-hidden
        style={{ background: "radial-gradient(ellipse 55% 60% at 85% 0%, rgba(var(--accent-rgb),0.12), transparent 70%)" }} />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28">
        <header className="mb-20 sm:mb-28">
          <SectionLabel index={section++} label={tr(EYEBROW)} />
          <h1 className="font-display font-bold leading-[1.02] tracking-[-0.025em]" style={{ fontSize: "clamp(40px,6vw,96px)", color: "var(--content)" }}>
            {t("title")}
          </h1>
          <p className="mt-6 max-w-2xl leading-relaxed" style={{ fontSize: "clamp(16px,1.3vw,19px)", color: "var(--content-secondary)" }}>{t("subtitle")}</p>

          {partners.length > 0 && (
            <dl className="mt-12 grid grid-cols-2 sm:flex sm:flex-wrap gap-y-8">
              {kpis.map(([v, label]) => (
                <div key={label} className="flex flex-col-reverse pr-6 sm:px-10 sm:first:pl-0 sm:border-l sm:first:border-l-0" style={{ borderColor: "var(--border)" }}>
                  <dt className="mt-2.5 text-xs uppercase tracking-[0.18em]" style={{ color: "var(--content-muted)" }}>{label}</dt>
                  <dd className="font-display font-bold leading-none tabular-nums" style={{ fontSize: "clamp(36px,3.8vw,60px)", background: "var(--hero-accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </header>

        {partners.length === 0 && <p className="py-24 text-center" style={{ color: "var(--content-muted)" }}>—</p>}

        {technology.length > 0 && (
          <section className="pb-24 sm:pb-32">
            <SectionHead index={section++} label={tr(EYEBROW)} title={tr(TECH_TITLE)} text={tr(TECH_TEXT)} />
            <TechnologyWall partners={technology} />
          </section>
        )}

        {industry.length > 0 && (
          <section className="pb-12">
            <SectionHead index={section++} label={tr(EYEBROW)} title={tr(IND_TITLE)} text={tr(IND_TEXT)} />
            <IndustryList partners={industry} />
          </section>
        )}
      </div>

      <FinaleCta locale={locale} />
    </div>
  );
}
