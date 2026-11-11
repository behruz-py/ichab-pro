import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { SectionLabel } from "@/components/editorial/SectionLabel";
import { ProjectsTimeline } from "@/components/projects/ProjectsTimeline";

type Props = { params: { locale: string } };
type Loc = Record<string, string>;

const EYEBROW: Loc = { uz: "Portfolio", ru: "Портфолио", en: "Portfolio" };
const K_PROJECTS: Loc = { uz: "Amalga oshirilgan loyiha", ru: "Реализованных проектов", en: "Completed projects" };
const K_PERIOD: Loc = { uz: "Faoliyat davri", ru: "Период работ", en: "Period" };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "projects" });
  return { title: t("title") };
}

export default async function ProjectsPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "projects" });
  const tr = (o: Loc) => o[locale] ?? o.uz;

  const res = await api.projects.list(locale).catch(() => null);
  const projects = res?.results ?? [];

  const years = projects.map((p) => p.completed_date && new Date(p.completed_date).getUTCFullYear()).filter((y): y is number => !!y);
  const period = years.length ? (Math.min(...years) === Math.max(...years) ? `${Math.min(...years)}` : `${Math.min(...years)}–${Math.max(...years)}`) : null;

  const kpis: [string, string][] = [];
  if (projects.length) kpis.push([String(res?.count ?? projects.length), tr(K_PROJECTS)]);
  if (period) kpis.push([period, tr(K_PERIOD)]);

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-[520px] pointer-events-none" aria-hidden
        style={{ background: "radial-gradient(ellipse 55% 60% at 85% 0%, rgba(var(--accent-rgb),0.12), transparent 70%)" }} />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-24">
        <header className="mb-12 sm:mb-16">
          <SectionLabel index={1} label={tr(EYEBROW)} />
          <h1 className="font-display font-bold leading-[1.02] tracking-[-0.025em]" style={{ fontSize: "clamp(40px,6vw,96px)", color: "var(--content)" }}>
            {t("title")}
          </h1>
          <p className="mt-6 max-w-2xl leading-relaxed" style={{ fontSize: "clamp(16px,1.3vw,19px)", color: "var(--content-secondary)" }}>{t("subtitle")}</p>

          {kpis.length > 0 && (
            <dl className="mt-12 grid grid-cols-2 sm:flex sm:flex-wrap gap-y-8">
              {kpis.map(([v, label], i) => (
                <div key={i} className="flex flex-col-reverse pr-6 sm:px-10 sm:first:pl-0 sm:border-l sm:first:border-l-0" style={{ borderColor: "var(--border)" }}>
                  <dt className="mt-2.5 text-xs uppercase tracking-[0.18em]" style={{ color: "var(--content-muted)" }}>{label}</dt>
                  <dd className="font-display font-bold leading-none tabular-nums" style={{ fontSize: "clamp(36px,3.8vw,60px)", background: "var(--hero-accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </header>

        {projects.length > 0 ? (
          <ProjectsTimeline projects={projects} locale={locale} />
        ) : (
          <p className="py-24 text-center" style={{ color: "var(--content-muted)" }}>—</p>
        )}
      </div>
    </div>
  );
}
