import type { Metadata } from "next";
import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { requireSession, staffFetch } from "@/lib/session";
import type { InternalDatasets, StaffUser } from "@/types/internal";
import { StaffBar } from "@/components/internal/StaffBar";
import { Reveal } from "@/components/ui/Reveal";
import { ProductionVolumeChart } from "@/components/sections/charts/ProductionVolumeChart";
import { ProductBreakdown2026 } from "@/components/sections/charts/ProductBreakdown2026";
import { EnergyEfficiencyTable } from "@/components/sections/charts/EnergyEfficiencyTable";
import { MainIndicatorsTable } from "@/components/sections/charts/MainIndicatorsTable";
import { CostEstimateTable } from "@/components/sections/charts/CostEstimateTable";
import { DivisionsShare2025 } from "@/components/sections/charts/DivisionsShare2025";
import { DivisionsSharePlan2026 } from "@/components/sections/charts/DivisionsSharePlan2026";
import { LocalizationGrowthChart } from "@/components/sections/charts/LocalizationGrowthChart";
import { LocalizedProducts2026 } from "@/components/sections/charts/LocalizedProducts2026";
import { StatsBackground } from "@/components/sections/stats/StatsBackground";
import { StatsHero } from "@/components/sections/stats/StatsHero";
import { StatsProgressNav } from "@/components/sections/stats/StatsProgressNav";
import { StatsSpotlight } from "@/components/sections/stats/StatsSpotlight";
import { SectionEyebrow } from "@/components/sections/stats/SectionEyebrow";

type Props = { params: { locale: string } };
type Loc = Record<string, string>;

const TITLE: Loc = { uz: "Statistika va yutuqlar", ru: "Статистика и достижения", en: "Statistics & Achievements" };
const EMPTY: Loc = {
  uz: "Ichki ma'lumotlar hali kiritilmagan. Ularni admin paneldagi «Ichki ma'lumotlar to'plamlari» bo'limidan qo'shish mumkin.",
  ru: "Внутренние данные ещё не внесены. Их можно добавить в админ-панели в разделе «Ichki ma'lumotlar to'plamlari».",
  en: "No internal data has been entered yet. It can be added in the admin panel under «Ichki ma'lumotlar to'plamlari».",
};

const L: Record<string, Loc> = {
  production: { uz: "Ishlab chiqarish", ru: "Производство", en: "Production" },
  breakdown:  { uz: "2026 reja", ru: "План 2026", en: "2026 plan" },
  indicators: { uz: "Ko'rsatkichlar", ru: "Показатели", en: "Indicators" },
  energy:     { uz: "Energiya samaradorligi", ru: "Энергоэффективность", en: "Energy efficiency" },
  cost:       { uz: "Xarajatlar smetasi", ru: "Смета расходов", en: "Cost estimate" },
  share25:    { uz: "Bo'linmalar ulushi 2025", ru: "Доля подразделений 2025", en: "Divisions share 2025" },
  share26:    { uz: "Bo'linmalar ulushi 2026", ru: "Доля подразделений 2026", en: "Divisions share 2026" },
  growth:     { uz: "Lokalizatsiya dinamikasi", ru: "Динамика локализации", en: "Localization growth" },
  products:   { uz: "Lokalizatsiyalangan mahsulotlar", ru: "Локализованная продукция", en: "Localized products" },
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  return { title: TITLE[locale] ?? TITLE.uz, robots: { index: false, follow: false } };
}

export default async function InternalStatisticsPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const path = `/${locale}/internal/statistics`;
  const token = requireSession(locale, path);
  const [user, ds] = await Promise.all([
    staffFetch<StaffUser>("auth/me/", token, locale, path),
    staffFetch<InternalDatasets>("internal/datasets/", token, locale, path),
  ]);
  const t = (o: Loc) => o[locale] ?? o.uz;

  const candidates: { id: string; rgb: string; node: ReactNode | null }[] = [
    { id: "production", rgb: "56,189,248",  node: ds.production_volume && <ProductionVolumeChart locale={locale} data={ds.production_volume} /> },
    { id: "breakdown",  rgb: "139,92,246",  node: ds.product_breakdown_2026 && <ProductBreakdown2026 locale={locale} data={ds.product_breakdown_2026} /> },
    { id: "indicators", rgb: "16,185,129",  node: ds.main_indicators && <MainIndicatorsTable locale={locale} data={ds.main_indicators} /> },
    { id: "energy",     rgb: "245,158,11",  node: ds.energy_efficiency && <EnergyEfficiencyTable locale={locale} data={ds.energy_efficiency} /> },
    { id: "cost",       rgb: "236,72,153",  node: ds.cost_estimate && <CostEstimateTable locale={locale} data={ds.cost_estimate} /> },
    { id: "share25",    rgb: "59,130,246",  node: ds.divisions_share_2025 && <DivisionsShare2025 locale={locale} data={ds.divisions_share_2025} /> },
    { id: "share26",    rgb: "34,211,238",  node: ds.divisions_share_2026 && <DivisionsSharePlan2026 locale={locale} data={ds.divisions_share_2026} /> },
    { id: "growth",     rgb: "16,185,129",  node: ds.localization_growth && <LocalizationGrowthChart locale={locale} data={ds.localization_growth} /> },
    { id: "products",   rgb: "139,92,246",  node: ds.localized_products_2026 && <LocalizedProducts2026 locale={locale} data={ds.localized_products_2026} /> },
  ];
  const sections = candidates.filter((s) => s.node).map((s) => ({ ...s, label: t(L[s.id]) }));

  return (
    <div className="stats-page relative">
      <StatsBackground />
      {sections.length > 0 && <StatsProgressNav sections={sections.map((s) => ({ id: s.id, label: s.label }))} />}
      <StatsSpotlight />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <StaffBar user={user} locale={locale} />
        <StatsHero locale={locale} kpis={ds.kpis ?? []} />

        {sections.length === 0 && (
          <p className="text-center mt-16 max-w-xl mx-auto" style={{ color: "var(--content-muted)" }}>{t(EMPTY)}</p>
        )}

        {sections.map((s, i) => (
          <section key={s.id} id={s.id} className="scroll-mt-28 mt-20">
            <Reveal variant="up">
              <SectionEyebrow index={i + 1} label={s.label} rgb={s.rgb} />
              {s.node}
            </Reveal>
          </section>
        ))}
      </div>
    </div>
  );
}
