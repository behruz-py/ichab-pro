"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import type { Product, ProductCategory } from "@/types/api";

interface Props {
  products: Product[];
  categories: ProductCategory[];
}

export function ProductsClient({ products, categories }: Props) {
  const locale = useLocale();
  const t = useTranslations("products");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = products;
    if (selectedCategory) list = list.filter(p => String(p.category?.id) === selectedCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.sku?.toLowerCase().includes(q) ?? false) ||
        (p.short_description?.toLowerCase().includes(q) ?? false)
      );
    }
    return list;
  }, [products, selectedCategory, search]);

  return (
    <>
      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
          style={{ color: "#94A3B8" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder={t("search_placeholder")}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border text-content placeholder:text-content-muted focus:outline-none focus:border-blue-500/50 transition-colors"
          style={{
            background: "rgba(255,255,255,0.04)",
            borderColor: "rgba(47,94,148,0.18)",
          }}
        />
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory("")}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={
              selectedCategory === ""
                ? { background: "#2F5E94", color: "#fff", boxShadow: "0 0 16px rgba(47,94,148,0.35)" }
                : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(47,94,148,0.18)", color: "#475569" }
            }
          >
            {t("filter_all")}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(String(cat.id))}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={
                selectedCategory === String(cat.id)
                  ? { background: "#2F5E94", color: "#fff", boxShadow: "0 0 16px rgba(47,94,148,0.35)" }
                  : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(47,94,148,0.18)", color: "#475569" }
              }
            >
              {cat.icon && <span className="mr-1">{cat.icon}</span>}
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => (
            <Link
              key={product.id}
              href={`/${locale}/products/${product.slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 border border-blue-500/[0.14] hover:border-blue-500/40 hover:shadow-[0_8px_32px_rgba(47,94,148,0.12)]"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              {/* Image */}
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "4/3", background: "rgba(247,249,252,0.8)" }}
              >
                {product.main_image ? (
                  <Image
                    src={product.main_image}
                    alt={product.name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.2" style={{ color: "#94A3B8" }}>
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <path d="M8 21h8M12 17v4" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                {product.category_name && (
                  <span className="text-xs font-semibold mb-1.5 uppercase tracking-wider"
                    style={{ color: "#2F5E94" }}>
                    {product.category_name}
                  </span>
                )}
                <h2
                  className="font-display font-semibold text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-[#244C77] transition-colors duration-200"
                  style={{ color: "#1E293B" }}
                >
                  {product.name}
                </h2>
                {product.short_description ? (
                  <p className="text-xs leading-relaxed mb-3 line-clamp-2 flex-1" style={{ color: "#475569" }}>
                    {product.short_description}
                  </p>
                ) : (
                  <div className="flex-1" />
                )}
                <span
                  className="text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-200"
                  style={{ color: "#2F5E94" }}
                >
                  {t("view_detail")} <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.2" style={{ color: "#94A3B8" }}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <p style={{ color: "#94A3B8" }}>{t("not_found")}</p>
        </div>
      )}
    </>
  );
}
