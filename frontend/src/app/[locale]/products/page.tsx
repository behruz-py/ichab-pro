import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { ProductsClient } from "./_ProductsClient";

export const revalidate = 60;

type Props = { params: { locale: string } };

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

  const [categoriesRes, productsRes] = await Promise.all([
    api.products.categories(locale),
    api.products.list({}, locale),
  ]);

  const categories = categoriesRes.results;
  const products   = productsRes.results;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="font-display font-bold text-content mb-3"
          style={{ fontSize: "clamp(28px, 4vw, 48px)" }}>
          {t("title")}
        </h1>
        <p style={{ color: "#7B93B8", fontSize: "17px" }}>{t("subtitle")}</p>
      </div>

      <ProductsClient products={products} categories={categories} />
    </div>
  );
}
