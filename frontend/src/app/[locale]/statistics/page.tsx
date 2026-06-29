import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { locales } from "@/i18n/request";
import { ProductionVolumeChart } from "@/components/sections/charts/ProductionVolumeChart";
import { ProductBreakdown2026 } from "@/components/sections/charts/ProductBreakdown2026";
import { EnergyEfficiencyTable } from "@/components/sections/charts/EnergyEfficiencyTable";
import { MainIndicatorsTable } from "@/components/sections/charts/MainIndicatorsTable";
import { CostEstimateTable } from "@/components/sections/charts/CostEstimateTable";

type Props = { params: { locale: string } };
type Loc = Record<string, string>;

const TITLE: Loc = { uz: "Statistika va yutuqlar", ru: "Статистика и достижения", en: "Statistics & Achievements" };
const SUB: Loc = {
  uz: "Korxonamizning o'sishi, ko'rsatkichlari va erishilgan natijalari",
  ru: "Рост, показатели и достигнутые результаты нашего предприятия",
  en: "Our company's growth, indicators and achieved results",
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 title-sheen inline-block pb-1">{t(TITLE)}</h1>
        <p className="text-content-secondary text-lg max-w-2xl mx-auto">{t(SUB)}</p>
      </div>

      <div className="space-y-10">
        <ProductionVolumeChart locale={locale} />
        <ProductBreakdown2026 locale={locale} />
        <MainIndicatorsTable locale={locale} />
        <EnergyEfficiencyTable locale={locale} />
        <CostEstimateTable locale={locale} />
        {/* Further charts are added here as data is provided. */}
      </div>
    </div>
  );
}
