import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { AboutShowcase, type TrustStat } from "./_AboutShowcase";

type Props = { params: { locale: string } };

const LABS_LABEL: Record<string, string> = { uz: "Laboratoriya", ru: "Лаборатория", en: "Laboratory" };
const PROJECTS_LABEL: Record<string, string> = { uz: "Amalga oshirilgan loyiha", ru: "Реализованный проект", en: "Completed project" };
const PARTNERS_LABEL: Record<string, string> = { uz: "Ishonchli hamkor", ru: "Надёжный партнёр", en: "Trusted partner" };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("about") };
}

export default async function AboutPage({ params: { locale } }: Props) {
  setRequestLocale(locale);

  const [missionR, visionR, historyR, divisionsR, projectsR, partnersR, statsR, certificatesR] = await Promise.allSettled([
    api.pages.byKey("about_mission", locale),
    api.pages.byKey("about_vision", locale),
    api.pages.byKey("about_history", locale),
    api.divisions.list(locale),
    api.projects.list(locale),
    api.partners.list(undefined, locale),
    api.stats.list(locale),
    api.certificates.list(locale),
  ]);

  const mission = missionR.status === "fulfilled" ? missionR.value : null;
  const vision = visionR.status === "fulfilled" ? visionR.value : null;
  const history = historyR.status === "fulfilled" ? historyR.value : null;
  const divisions = divisionsR.status === "fulfilled" ? divisionsR.value.results : [];
  const certificates = certificatesR.status === "fulfilled" ? certificatesR.value.results : [];

  const trustStats: TrustStat[] = [];
  if (divisionsR.status === "fulfilled" && divisionsR.value.count > 0) {
    trustStats.push({ value: divisionsR.value.count, label: LABS_LABEL[locale] ?? LABS_LABEL.uz });
  }
  if (projectsR.status === "fulfilled" && projectsR.value.count > 0) {
    trustStats.push({ value: projectsR.value.count, label: PROJECTS_LABEL[locale] ?? PROJECTS_LABEL.uz });
  }
  if (partnersR.status === "fulfilled" && partnersR.value.count > 0) {
    trustStats.push({ value: partnersR.value.count, label: PARTNERS_LABEL[locale] ?? PARTNERS_LABEL.uz });
  }
  // Admin-entered verified stats (e.g. "5000+ Mahsulot nomenklaturasi") slot
  // in alongside the counted ones above — both are real, neither is invented.
  if (statsR.status === "fulfilled") {
    for (const s of statsR.value.results) {
      trustStats.push({ value: s.value, label: s.label, suffix: s.suffix });
    }
  }

  return (
    <AboutShowcase
      locale={locale}
      mission={mission}
      vision={vision}
      history={history}
      divisions={divisions}
      trustStats={trustStats}
      certificates={certificates}
    />
  );
}
