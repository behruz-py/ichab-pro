import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { ProductGallery } from "../_ProductGallery";

type Props = { params: { locale: string; slug: string } };

export const revalidate = 60;

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
    return { title: product.name };
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

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

        {/* ── Gallery (interactive client component) ── */}
        <ProductGallery
          images={images}
          productName={product.name}
          locale={locale}
          noImageText={t("no_image")}
        />

        {/* ── Info ── */}
        <div className="flex flex-col gap-5">
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

          {product.description ? (
            <p className="leading-relaxed whitespace-pre-line" style={{ color: "#7B93B8", fontSize: "15px" }}>
              {product.description}
            </p>
          ) : (
            <p className="text-sm italic" style={{ color: "#344768" }}>{t("no_description")}</p>
          )}

          {product.catalog_file && (
            <a
              href={product.catalog_file}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm w-fit transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
                color: "#fff",
                boxShadow: "0 6px 24px rgba(59,130,246,0.28)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {t("catalog_pdf")}
            </a>
          )}
        </div>
      </div>

      {/* ── Texnik xususiyatlar ── */}
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
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Back */}
      <Link
        href={`/${locale}/products`}
        className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-300"
        style={{ color: "#60A5FA" }}
      >
        ← {t("back_to_catalog")}
      </Link>
    </div>
  );
}
