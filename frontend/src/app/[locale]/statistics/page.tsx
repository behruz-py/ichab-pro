import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { locales } from "@/i18n/request";
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
import { StatsCta } from "@/components/sections/stats/StatsCta";

type Props = { params: { locale: string } };
type Loc = Record<string, string>;

const TITLE: Loc = { uz: "Statistika va yutuqlar", ru: "Статистика и достижения", en: "Statistics & Achievements" };

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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  return { title: TITLE[locale] ?? TITLE.uz };
}

export default async function StatisticsPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = (o: Loc) => o[locale] ?? o.uz;

  const sections = [
    { id: "production", rgb: "56,189,248",  label: t(L.production), node: <ProductionVolumeChart locale={locale} /> },
    { id: "breakdown",  rgb: "139,92,246",  label: t(L.breakdown),  node: <ProductBreakdown2026 locale={locale} /> },
    { id: "indicators", rgb: "16,185,129",  label: t(L.indicators), node: <MainIndicatorsTable locale={locale} /> },
    { id: "energy",     rgb: "245,158,11",  label: t(L.energy),     node: <EnergyEfficiencyTable locale={locale} /> },
    { id: "cost",       rgb: "236,72,153",  label: t(L.cost),       node: <CostEstimateTable locale={locale} /> },
    { id: "share25",    rgb: "59,130,246",  label: t(L.share25),    node: <DivisionsShare2025 locale={locale} /> },
    { id: "share26",    rgb: "34,211,238",  label: t(L.share26),    node: <DivisionsSharePlan2026 locale={locale} /> },
    { id: "growth",     rgb: "16,185,129",  label: t(L.growth),     node: <LocalizationGrowthChart locale={locale} /> },
    { id: "products",   rgb: "139,92,246",  label: t(L.products),   node: <LocalizedProducts2026 locale={locale} /> },
  ];

  return (
    <div className="stats-page relative">
      <StatsBackground />
      <StatsProgressNav sections={sections.map((s) => ({ id: s.id, label: s.label }))} />
      <StatsSpotlight />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <StatsHero locale={locale} />

        {sections.map((s, i) => (
          <section key={s.id} id={s.id} className="scroll-mt-28 mt-20">
            <Reveal variant="up">
              <SectionEyebrow index={i + 1} label={s.label} rgb={s.rgb} />
              {s.node}
            </Reveal>
          </section>
        ))}

        <StatsCta locale={locale} />
      </div>
    </div>
  );
}
