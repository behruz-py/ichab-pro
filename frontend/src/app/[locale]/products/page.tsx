import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { SectionLabel } from "@/components/editorial/SectionLabel";
import { categoryIdOf } from "@/components/products/shared";
import { ProductsClient } from "./_ProductsClient";

export const revalidate = 60;

type Props = { params: { locale: string } };

const EYEBROW: Record<string, string> = { uz: "Katalog", ru: "Каталог", en: "Catalogue" };
const UNIT: Record<string, string> = { uz: "mahsulot", ru: "изделий", en: "products" };
const CATS: Record<string, string> = { uz: "yo'nalish", ru: "направлений", en: "categories" };

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "products" });
  return { title: t("title") };
}

export default async function ProductsPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "products" });

  // Resilient to the backend being unavailable at build time — degrade to an
  // empty catalogue instead of failing the whole static export.
  const [categoriesRes, productsRes] = await Promise.all([
    api.products.categories(locale).catch(() => null),
    api.products.list({}, locale).catch(() => null),
  ]);

  const categories = categoriesRes?.results ?? [];
  const products   = productsRes?.results ?? [];
  const usedCats = new Set(products.map(categoryIdOf).filter((v) => v != null)).size;

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-[520px] pointer-events-none" aria-hidden
        style={{ background: "radial-gradient(ellipse 55% 60% at 85% 0%, rgba(var(--accent-rgb),0.12), transparent 70%)" }} />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-24">
        <header className="grid lg:grid-cols-12 gap-10 mb-14 sm:mb-20">
          <div className="lg:col-span-8">
            <SectionLabel index={1} label={EYEBROW[locale] ?? EYEBROW.uz} />
            <h1 className="font-display font-bold leading-[1.02] tracking-[-0.025em]" style={{ fontSize: "clamp(40px,6vw,96px)", color: "var(--content)" }}>
              {t("title")}
            </h1>
            <p className="mt-6 max-w-2xl leading-relaxed" style={{ fontSize: "clamp(16px,1.3vw,19px)", color: "var(--content-secondary)" }}>{t("subtitle")}</p>
          </div>
          {products.length > 0 && (
            <div className="lg:col-span-4 lg:self-end flex gap-10 lg:justify-end">
              {[[products.length, UNIT], [usedCats, CATS]].map(([n, label], i) => (
                <div key={i}>
                  <div className="font-display font-bold leading-none tabular-nums" style={{ fontSize: "clamp(44px,4.4vw,72px)", background: "var(--hero-accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {n as number}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.2em]" style={{ color: "var(--content-muted)" }}>{(label as Record<string, string>)[locale] ?? (label as Record<string, string>).uz}</div>
                </div>
              ))}
            </div>
          )}
        </header>

        <ProductsClient products={products} categories={categories} />
      </div>
    </div>
  );
}
