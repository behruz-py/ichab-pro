import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Send, FileDown } from "lucide-react";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import type { Product, Availability } from "@/types/api";
import { ProductGallery } from "../_ProductGallery";
import { SpecTable } from "../_SpecTable";

type Props = { params: { locale: string; slug: string } };

export const revalidate = 60;

const SCHEMA_AVAILABILITY: Record<Availability, string> = {
  available: "https://schema.org/InStock",
  on_order: "https://schema.org/PreOrder",
  discontinued: "https://schema.org/Discontinued",
};

const AVAILABILITY_STYLE: Record<Availability, { bg: string; color: string }> = {
  available:    { bg: "rgba(34,197,94,0.12)",   color: "#4ade80" },
  on_order:     { bg: "rgba(245,158,11,0.12)",  color: "#fbbf24" },
  discontinued: { bg: "rgba(148,163,184,0.12)", color: "#94a3b8" },
};

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

  const images = product.images ?? [];
  const specs  = product.specs  ?? [];
  const table  = product.variant_table ?? null;
  const availability: Availability = product.availability ?? "available";
  const availStyle = AVAILABILITY_STYLE[availability];
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
    ...(product.category ? { category: product.category.name } : {}),
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-8 flex-wrap" style={{ color: "#344768" }}>
        <Link href={`/${locale}/products`} className="transition-colors hover:text-blue-400">
          {t("title")}
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <span style={{ color: "#7B93B8" }}>{product.category.name}</span>
            <span>/</span>
          </>
        )}
        <span style={{ color: "#E2EAF4" }}>{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        <ProductGallery
          images={images}
          productName={product.name}
          locale={locale}
          noImageText={t("no_image")}
        />

        {/* ── Info ── */}
        <div className="flex flex-col gap-4">
          {product.category && (
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#3B82F6" }}>
              {product.category.name}
            </span>
          )}

          <h1
            className="font-display font-bold leading-tight"
            style={{ fontSize: "clamp(22px,3vw,36px)", color: "#E2EAF4" }}
          >
            {product.name || slug}
          </h1>

          {/* SKU / brand / availability */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {product.sku && (
              <span style={{ color: "#7B93B8" }}>
                {t("sku")}: <span style={{ color: "#E2EAF4", fontWeight: 600 }}>{product.sku}</span>
              </span>
            )}
            {product.brand && (
              <span style={{ color: "#7B93B8" }}>
                {t("brand")}: <span style={{ color: "#E2EAF4", fontWeight: 600 }}>{product.brand}</span>
              </span>
            )}
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: availStyle.bg, color: availStyle.color }}
            >
              {t(`availability_${availability}`)}
            </span>
          </div>

          {product.description ? (
            <p className="leading-relaxed whitespace-pre-line" style={{ color: "#7B93B8", fontSize: "15px" }}>
              {product.description}
            </p>
          ) : product.short_description ? (
            <p className="leading-relaxed" style={{ color: "#7B93B8", fontSize: "15px" }}>
              {product.short_description}
            </p>
          ) : (
            <p className="text-sm italic" style={{ color: "#344768" }}>{t("no_description")}</p>
          )}

          <div className="flex flex-wrap gap-3 mt-1">
            {/* Primary CTA — request a quote (catalog / lead-gen) */}
            <Link
              href={`/${locale}/contact?product=${encodeURIComponent(product.name)}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
                color: "#fff",
                boxShadow: "0 6px 24px rgba(59,130,246,0.28)",
              }}
            >
              <Send size={16} />
              {t("request_quote")}
            </Link>

            {product.catalog_file && (
              <a
                href={product.catalog_file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
                style={{ border: "1px solid rgba(59,130,246,0.3)", color: "#60A5FA" }}
              >
                <FileDown size={16} />
                {t("catalog_pdf")}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Simple specs ── */}
      {specs.length > 0 && (
        <div className="rounded-2xl overflow-hidden mb-10"
          style={{ border: "1px solid rgba(59,130,246,0.14)" }}>
          <div className="px-6 py-4"
            style={{ background: "rgba(59,130,246,0.06)", borderBottom: "1px solid rgba(59,130,246,0.14)" }}>
            <h2 className="font-display font-bold text-lg" style={{ color: "#E2EAF4" }}>
              {t("specs_title")}
            </h2>
          </div>
          <table className="w-full">
            <tbody>
              {specs.map((spec, i) => (
                <tr key={spec.id}
                  style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                  <td className="px-6 py-3 text-sm font-medium w-1/2"
                    style={{ color: "#7B93B8", borderBottom: "1px solid rgba(59,130,246,0.08)" }}>
                    {spec.label}
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold w-1/2"
                    style={{ color: "#E2EAF4", borderBottom: "1px solid rgba(59,130,246,0.08)" }}>
                    {spec.value}{spec.unit ? ` ${spec.unit}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Multi-column comparison table ── */}
      {table && (
        <SpecTable table={table} title={t("comparison_title")} paramHeader={t("param_header")} />
      )}

      {/* Back */}
      <Link
        href={`/${locale}/products`}
        className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-300"
        style={{ color: "#60A5FA" }}
      >
        <ArrowLeft size={16} /> {t("back_to_catalog")}
      </Link>
    </div>
  );
}
