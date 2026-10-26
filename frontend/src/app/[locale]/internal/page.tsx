import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { BarChart3, Tags, Building2, ArrowRight, type LucideIcon } from "lucide-react";
import { requireSession, staffFetch } from "@/lib/session";
import { StaffBar } from "@/components/internal/StaffBar";
import type { StaffUser } from "@/types/internal";

type Props = { params: { locale: string } };
type Loc = Record<string, string>;

const TITLE: Loc = { uz: "Ichki bo'lim", ru: "Внутренний раздел", en: "Internal section" };
const SUB: Loc = {
  uz: "Korxonaning to'liq salohiyatini ko'rsatuvchi ichki ko'rsatkichlar — faqat xodimlar uchun",
  ru: "Внутренние показатели, отражающие полный потенциал предприятия — только для сотрудников",
  en: "Internal indicators showing the company's full capacity — for staff only",
};
const SOON: Loc = { uz: "Tez orada", ru: "Скоро", en: "Coming soon" };

interface Item { href?: string; Icon: LucideIcon; rgb: string; title: Loc; desc: Loc }
const ITEMS: Item[] = [
  {
    href: "/internal/statistics", Icon: BarChart3, rgb: "56,189,248",
    title: { uz: "Statistika va ko'rsatkichlar", ru: "Статистика и показатели", en: "Statistics & indicators" },
    desc: { uz: "Ishlab chiqarish hajmi, xarajatlar smetasi, bo'linmalar ulushi, lokalizatsiya", ru: "Объём производства, смета расходов, доли подразделений, локализация", en: "Production volume, cost estimate, division shares, localization" },
  },
  {
    Icon: Tags, rgb: "245,158,11",
    title: { uz: "Mahsulot narxlari", ru: "Цены на продукцию", en: "Product prices" },
    desc: { uz: "Mahsulotlarning ichki narxlari va tannarxi", ru: "Внутренние цены и себестоимость продукции", en: "Internal product prices and cost" },
  },
  {
    Icon: Building2, rgb: "16,185,129",
    title: { uz: "Obyektlar bo'yicha loyihalar", ru: "Проекты по объектам", en: "Projects by site" },
    desc: { uz: "Loyihalar summalari va obyektlar kesimidagi ko'rsatkichlar", ru: "Суммы проектов и показатели в разрезе объектов", en: "Project values and per-site indicators" },
  },
];

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  return { title: TITLE[locale] ?? TITLE.uz, robots: { index: false, follow: false } };
}

export default async function InternalHomePage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const path = `/${locale}/internal`;
  const token = requireSession(locale, path);
  const user = await staffFetch<StaffUser>("auth/me/", token, locale, path);
  const t = (o: Loc) => o[locale] ?? o.uz;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <StaffBar user={user} locale={locale} />

      <h1 className="font-display font-bold text-content leading-tight" style={{ fontSize: "clamp(30px,4vw,48px)" }}>{t(TITLE)}</h1>
      <p className="mt-3 max-w-2xl" style={{ color: "var(--content-secondary)", fontSize: 17 }}>{t(SUB)}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
        {ITEMS.map((it, i) => {
          const body = (
            <>
              <span className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `rgba(${it.rgb},0.14)`, border: `1px solid rgba(${it.rgb},0.3)` }}>
                <it.Icon size={22} style={{ color: `rgb(${it.rgb})` }} />
              </span>
              <h2 className="font-display font-bold text-lg text-content mb-2">{t(it.title)}</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--content-secondary)" }}>{t(it.desc)}</p>
              <span className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold" style={{ color: it.href ? `rgb(${it.rgb})` : "var(--content-muted)" }}>
                {it.href ? <>{t(it.title)} <ArrowRight size={15} /></> : t(SOON)}
              </span>
            </>
          );
          const style = { background: "var(--card-bg)", border: `1px solid rgba(${it.rgb},0.22)`, boxShadow: "var(--card-shadow)" };
          return it.href ? (
            <Link key={i} href={`/${locale}${it.href}`} className="rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1.5" style={style}>{body}</Link>
          ) : (
            <div key={i} className="rounded-2xl p-6 opacity-60" style={style} aria-disabled>{body}</div>
          );
        })}
      </div>
    </div>
  );
}
