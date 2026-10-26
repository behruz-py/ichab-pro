import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { EditorialHero, type HeroStat } from "@/components/editorial/EditorialHero";
import { PillLink } from "@/components/editorial/PillLink";
import { ScrollRevealText } from "@/components/editorial/ScrollRevealText";
import { KineticMarquee, MARQUEE_WORDS } from "@/components/editorial/KineticMarquee";
import { FinaleCta } from "@/components/editorial/FinaleCta";
import { ProjectsShowcase } from "@/components/home/ProjectsShowcase";
import { ServicesShowcase } from "@/components/home/ServicesShowcase";
import { ProcessEditorial } from "@/components/home/ProcessEditorial";
import { DivisionsPreview } from "@/components/sections/DivisionsPreview";
import { PartnersMarquee } from "@/components/sections/PartnersMarquee";

type Props = { params: { locale: string } };
type Loc = Record<string, string>;
const t = (o: Loc, l: string) => o[l] ?? o.uz;

const TECH_TAGS = ["PLC", "SCADA", "HMI", "VFD", "IoT", "DCS"];

const L = {
  who:      { uz: "Biz kimmiz", ru: "Кто мы", en: "Who we are" },
  projects: { uz: "Loyihalar", ru: "Проекты", en: "Projects" },
  services: { uz: "Xizmatlar", ru: "Услуги", en: "Services" },
  process:  { uz: "Jarayon", ru: "Процесс", en: "Process" },
  labs:     { uz: "Laboratoriya", ru: "Лаборатория", en: "Laboratory" },
  done:     { uz: "Amalga oshirilgan loyiha", ru: "Реализованный проект", en: "Completed project" },
} satisfies Record<string, Loc>;

// Condensed from the department's own description (about_mission).
const STATEMENT: Loc = {
  uz: "Biz — «Navoiy kon-metallurgiya kombinati» tarkibidagi bo'linmamiz. Texnologik jarayonlarni avtomatlashtirish, ASUTP va SCADA tizimlarini joriy etish hamda nostandart avtomatlashtirish vositalarini ishlab chiqarish bo'yicha «kalit taslim» yechimlarini taqdim etamiz.",
  ru: "Мы — подразделение АО «Навоийский горно-металлургический комбинат». Мы предлагаем решения «под ключ» по автоматизации технологических процессов, внедрению систем АСУТП и SCADA и производству нестандартных средств автоматизации.",
  en: "We are a division of Navoi Mining and Metallurgical Company, delivering turnkey solutions for process automation, APCS and SCADA deployment, and the manufacture of non-standard automation equipment.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const tHero = await getTranslations({ locale, namespace: "hero" });
  return {
    title: `${tHero("title")} ${tHero("title_accent")}`,
    description: tHero("subtitle"),
  };
}

export default async function HomePage({ params: { locale } }: Props) {
  setRequestLocale(locale);

  const [tHero, tProjects, tDivisions, tServices, tPartners] = await Promise.all([
    getTranslations({ locale, namespace: "hero" }),
    getTranslations({ locale, namespace: "projects" }),
    getTranslations({ locale, namespace: "divisions" }),
    getTranslations({ locale, namespace: "services" }),
    getTranslations({ locale, namespace: "partners" }),
  ]);

  const [statsRes, projectsRes, divisionsRes, servicesRes, partnersRes] = await Promise.allSettled([
    api.stats.list(locale),
    api.projects.list(locale),
    api.divisions.list(locale),
    api.services.list(locale),
    api.partners.list(true, locale),
  ]);

  const stats     = statsRes.status     === "fulfilled" ? statsRes.value.results     : [];
  const projects  = projectsRes.status  === "fulfilled" ? projectsRes.value.results  : [];
  const projectCount = projectsRes.status === "fulfilled" ? projectsRes.value.count  : 0;
  const divisions = divisionsRes.status === "fulfilled" ? divisionsRes.value.results : [];
  const services  = servicesRes.status  === "fulfilled" ? servicesRes.value.results  : [];
  const partners  = partnersRes.status  === "fulfilled" ? partnersRes.value.results  : [];

  // Only real, counted figures — no marketing round numbers.
  const heroStats: HeroStat[] = [];
  if (divisions.length > 0) heroStats.push({ value: divisions.length, label: t(L.labs, locale) });
  if (projectCount > 0) heroStats.push({ value: projectCount, label: t(L.done, locale) });
  for (const s of stats) heroStats.push({ value: s.value, label: s.label, suffix: s.suffix });

  let n = 0;
  const next = () => ++n;

  return (
    <>
      <EditorialHero
        badge={tHero("badge")}
        title={`${tHero("title")} ${tHero("title_accent")}`}
        uppercase
        subtitle={tHero("subtitle")}
        stats={heroStats}
        scrollLabel={tHero("scroll_hint")}
        tags={TECH_TAGS}
        dial
        actions={
          <>
            <PillLink href={`/${locale}/contact`}>{tHero("cta_primary")}</PillLink>
            <PillLink href={`/${locale}/projects`} variant="ghost">{tHero("cta_secondary")}</PillLink>
          </>
        }
      />

      <ScrollRevealText index={next()} label={t(L.who, locale)} text={t(STATEMENT, locale)} />
      <KineticMarquee words={MARQUEE_WORDS[locale] ?? MARQUEE_WORDS.uz} />

      {projects.length > 0 && (
        <ProjectsShowcase
          index={next()}
          label={t(L.projects, locale)}
          locale={locale}
          projects={projects}
          total={projectCount}
          title={tProjects("title")}
          subtitle={tProjects("subtitle")}
          viewAll={tProjects("view_all")}
        />
      )}

      {divisions.length > 0 && (
        <DivisionsPreview
          index={next()}
          divisions={divisions}
          locale={locale}
          title={tDivisions("title")}
          subtitle={tDivisions("subtitle")}
          viewAll={tDivisions("view_all")}
        />
      )}

      {services.length > 0 && (
        <ServicesShowcase
          index={next()}
          label={t(L.services, locale)}
          locale={locale}
          services={services}
          title={tServices("title")}
          subtitle={tServices("subtitle")}
          viewAll={tServices("view_all")}
        />
      )}

      <ProcessEditorial index={next()} label={t(L.process, locale)} locale={locale} />

      {partners.length > 0 && (
        <PartnersMarquee partners={partners} title={tPartners("title")} subtitle={tPartners("subtitle")} />
      )}

      <FinaleCta locale={locale} />
    </>
  );
}
