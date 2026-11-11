import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileDown, Factory, Tag } from "lucide-react";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import type { Product, Availability, ProductCategory } from "@/types/api";
import { SectionLabel } from "@/components/editorial/SectionLabel";
import { PillLink } from "@/components/editorial/PillLink";
import { ProductCard } from "@/components/products/ProductCard";
import { AVAIL_RGB, PRODUCT_PALETTE } from "@/components/products/shared";
import { ProductGallery } from "../_ProductGallery";
import { SpecTable } from "../_SpecTable";

type Props = { params: { locale: string; slug: string } };

export const revalidate = 60;

const SCHEMA_AVAILABILITY: Record<Availability, string> = {
  available: "https://schema.org/InStock",
  on_order: "https://schema.org/PreOrder",
  discontinued: "https://schema.org/Discontinued",
};

const SPECS_LABEL: Record<string, string> = { uz: "Xususiyatlar", ru: "Характеристики", en: "Specifications" };
const RELATED_LABEL: Record<string, string> = { uz: "Shu yo'nalishda", ru: "В этом направлении", en: "In this category" };

function mainImageOf(product: Product): string | null {
  const imgs = product.images ?? [];
  const main = imgs.find(i => i.is_main) ?? imgs[0];
  return main?.image ?? null;
}

export async function generateStaticParams() {
  try {
    const results = await Promise.all(
      locales.map(async locale => {
        const res = await api.products.list({}, locale);
        return res.results.map(p => ({ locale, slug: p.slug }));
      })
    );
    return results.flat();
  } catch {
    return [];
  }
}

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  try {
    const product = await api.products.detail(slug, locale);
    const title = product.meta_title || product.name;
    const description = product.meta_description || product.short_description || undefined;
    const image = mainImageOf(product);
    return {
      title,
      description,
      alternates: {
        canonical: `/${locale}/products/${slug}`,
        languages: Object.fromEntries(locales.map(l => [l, `/${l}/products/${slug}`])),
      },
      openGraph: {
        type: "website",
        title,
        description,
        url: `${SITE_URL}/${locale}/products/${slug}`,
        images: image ? [{ url: image }] : undefined,
      },
    };
  } catch {
    return {};
  }
}

export default async function ProductDetailPage({ params: { locale, slug } }: Props) {
  setRequestLocale(locale);

  const product = await api.products.detail(slug, locale).catch(() => notFound());
  const t = await getTranslations({ locale, namespace: "products" });

  const category = typeof product.category === "object" ? product.category : null;
  const [categoriesRes, relatedRes] = await Promise.all([
    api.products.categories(locale).catch(() => null),
    category ? api.products.list({ category: String(category.id) }, locale).catch(() => null) : Promise.resolve(null),
  ]);
  const categories: ProductCategory[] = categoriesRes?.results ?? [];
  const catPos = category ? categories.findIndex((c) => c.id === category.id) : -1;
  const rgb = PRODUCT_PALETTE[Math.max(catPos, 0) % PRODUCT_PALETTE.length];
  const related = (relatedRes?.results ?? []).filter((p) => p.slug !== slug).slice(0, 3);

  const images = product.images ?? [];
  const specs  = product.specs  ?? [];
  const table  = product.variant_table ?? null;
  const availability: Availability = product.availability ?? "available";
  const canonical = `${SITE_URL}/${locale}/products/${slug}`;
  const image = mainImageOf(product);

  // ─── JSON-LD structured data (SEO / Google rich results) ──────────────────
  const productLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    ...(image ? { image: [image] } : {}),
    ...(product.meta_description || product.short_description
      ? { description: product.meta_description || product.short_description }
      : {}),
    ...(product.sku ? { sku: product.sku } : {}),
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    ...(category ? { category: category.name } : {}),
    offers: {
      "@type": "Offer",
      url: canonical,
      availability: SCHEMA_AVAILABILITY[availability],
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("title"), item: `${SITE_URL}/${locale}/products` },
      { "@type": "ListItem", position: 2, name: product.name, item: canonical },
    ],
  };

  return (
    <div className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="absolute inset-x-0 top-0 h-[560px] pointer-events-none" aria-hidden
        style={{ background: `radial-gradient(ellipse 50% 60% at 20% 0%, rgba(${rgb},0.14), transparent 70%)` }} />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-20 sm:pb-24">
        <nav className="flex items-center gap-2 text-sm mb-6 sm:mb-8 flex-wrap" style={{ color: "var(--content-muted)" }}>
          <Link href={`/${locale}/products`} className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--accent)]">
            <ArrowLeft size={15} /> {t("title")}
          </Link>
          {category && (<><span>/</span><span style={{ color: "var(--content-secondary)" }}>{category.name}</span></>)}
        </nav>

        <div className="grid md:grid-cols-12 gap-8 md:gap-10 lg:gap-16 mb-16 sm:mb-24">
          <div className="md:col-span-6 lg:col-span-7">
            <ProductGallery images={images} productName={product.name} locale={locale} noImageText={t("no_image")} rgb={rgb} iconName={category?.icon} />
          </div>

          <div className="md:col-span-6 lg:col-span-5">
            <div className="md:sticky md:top-24 lg:top-28 flex flex-col lg:pt-4">
              <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-6">
                {product.sku && (
                  <span className="font-mono text-sm font-bold px-3 py-1 rounded-lg" style={{ color: `rgb(${rgb})`, background: `rgba(${rgb},0.12)` }}>{product.sku}</span>
                )}
                {category && (
                  <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--content-muted)" }}>{category.name}</span>
                )}
              </div>

              <h1 className="font-display font-bold leading-[1.05] tracking-[-0.02em] first-letter:uppercase" style={{ fontSize: "clamp(28px,3.4vw,52px)", color: "var(--content)" }}>
                {product.name || slug}
              </h1>

              {product.short_description && (
                <p className="mt-4 sm:mt-6 leading-relaxed max-w-[60ch]" style={{ fontSize: "clamp(15px,1.15vw,18px)", color: "var(--content-secondary)" }}>{product.short_description}</p>
              )}

              <dl className="mt-6 sm:mt-8 grid grid-cols-2" style={{ borderTop: "1px solid var(--border)" }}>
                {product.brand && (
                  <div className="py-4 pr-4" style={{ borderBottom: "1px solid var(--border)" }}>
                    <dt className="flex items-center gap-1.5 text-xs uppercase tracking-[0.16em]" style={{ color: "var(--content-muted)" }}><Factory size={13} /> {t("brand")}</dt>
                    <dd className="mt-1.5 font-semibold" style={{ color: "var(--content)" }}>{product.brand}</dd>
                  </div>
                )}
                <div className="py-4 pr-4" style={{ borderBottom: "1px solid var(--border)" }}>
                  <dt className="flex items-center gap-1.5 text-xs uppercase tracking-[0.16em]" style={{ color: "var(--content-muted)" }}><Tag size={13} /> {t("availability")}</dt>
                  <dd className="mt-1.5 inline-flex items-center gap-2 font-semibold" style={{ color: "var(--content)" }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: `rgb(${AVAIL_RGB[availability]})`, boxShadow: `0 0 8px rgba(${AVAIL_RGB[availability]},0.7)` }} />
                    {t(`availability_${availability}`)}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <PillLink href={`/${locale}/contact?product=${encodeURIComponent(product.name)}`}>{t("request_quote")}</PillLink>
                {product.catalog_file && (
                  <a href={product.catalog_file} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80" style={{ color: "var(--accent)" }}>
                    <FileDown size={17} /> {t("catalog_pdf")}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {(product.description || specs.length > 0 || table) && (
          <section className={related.length > 0 ? "mb-20 sm:mb-28" : ""}>
            <SectionLabel index={1} label={SPECS_LABEL[locale] ?? SPECS_LABEL.uz} />
            <div className={`grid gap-12 lg:gap-16 ${product.description && specs.length > 0 ? "lg:grid-cols-12" : ""}`}>
              {product.description && (
                <p className={`leading-[1.75] whitespace-pre-line max-w-[68ch] ${specs.length > 0 ? "lg:col-span-7" : ""}`}
                  style={{ fontSize: "clamp(16px,1.25vw,19px)", color: "var(--content)" }}>{product.description}</p>
              )}

              {specs.length > 0 && (
                <div className={product.description ? "lg:col-span-5" : "max-w-3xl"}>
                  <h2 className="font-display font-bold mb-3" style={{ fontSize: "clamp(19px,1.6vw,24px)", color: "var(--content)" }}>{t("specs_title")}</h2>
                  <dl style={{ borderTop: "1px solid var(--border)" }}>
                    {specs.map((spec) => (
                      <div key={spec.id} className="flex items-baseline justify-between gap-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                        <dt className="flex-1 min-w-0 text-[15px]" style={{ color: "var(--content-secondary)" }}>{spec.label}</dt>
                        <dd className="max-w-[60%] font-semibold text-[15px] text-right" style={{ color: "var(--content)" }}>
                          {spec.value}{spec.unit ? <span className="ml-1 font-normal" style={{ color: "var(--content-muted)" }}>{spec.unit}</span> : null}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>

            {table && <div className="mt-14"><SpecTable table={table} title={t("comparison_title")} paramHeader={t("param_header")} /></div>}
          </section>
        )}

        {!product.description && !product.short_description && specs.length === 0 && !table && (
          <p className="italic" style={{ color: "var(--content-muted)" }}>{t("no_description")}</p>
        )}

        {related.length > 0 && (
          <section>
            <SectionLabel index={product.description || specs.length > 0 || table ? 2 : 1} label={RELATED_LABEL[locale] ?? RELATED_LABEL.uz} />
            <h2 className="font-display font-bold leading-[1.05] tracking-[-0.02em] mb-4" style={{ fontSize: "clamp(28px,3vw,44px)", color: "var(--content)" }}>{t("related")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} rgb={rgb}
                  availabilityLabel={t(`availability_${(p.availability ?? "available") as Availability}`)} iconName={category?.icon} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
