"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { mediaUrl } from "@/lib/utils";
import type { ProductCategory, Product } from "@/types/api";

function CategoryFilter({
  categories,
  selected,
  onSelect,
  labelAll,
}: {
  categories: ProductCategory[];
  selected: string;
  onSelect: (id: string) => void;
  labelAll: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onSelect("")}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          selected === ""
            ? "bg-accent text-surface shadow-glow"
            : "glass-card border border-border-subtle text-content-secondary hover:text-content hover:border-accent/30"
        }`}
      >
        {labelAll}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(String(cat.id))}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
            selected === String(cat.id)
              ? "bg-accent text-surface shadow-glow"
              : "glass-card border border-border-subtle text-content-secondary hover:text-content hover:border-accent/30"
          }`}
        >
          {cat.icon && <span>{cat.icon}</span>}
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const locale = useLocale();
  const t = useTranslations("products");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories", locale],
    queryFn: () => api.products.categories(locale),
  });

  const params: Record<string, string> = {};
  if (selectedCategory) params.category = selectedCategory;
  if (search) params.search = search;

  const { data: productsRes, isLoading } = useQuery({
    queryKey: ["products", locale, selectedCategory, search],
    queryFn: () => api.products.list(params, locale),
  });

  const categories = categoriesRes?.results.filter((c) => !c.parent) ?? [];
  const products = productsRes?.results ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-content mb-4">{t("title")}</h1>
        <p className="text-content-secondary text-lg max-w-2xl">{t("subtitle")}</p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted">🔍</span>
        <input
          type="text"
          placeholder={t("search_placeholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl glass-card border border-border-subtle text-content placeholder:text-content-muted focus:outline-none focus:border-accent/50 transition-colors"
        />
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          labelAll={t("filter_category")}
        />
      )}

      {/* Products grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-72 animate-pulse border border-border-subtle" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/${locale}/products/${product.slug}`}
              className="group glass-card rounded-2xl border border-border-subtle overflow-hidden hover:border-accent/40 transition-all duration-300 hover:shadow-glow flex flex-col"
            >
              <div className="relative h-48 bg-surface-secondary overflow-hidden">
                {product.main_image ? (
                  <Image
                    src={mediaUrl(product.main_image)}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-content-muted">
                    📦
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                {product.category_name && (
                  <span className="text-accent text-xs font-medium mb-1">{product.category_name}</span>
                )}
                <h2 className="font-display font-semibold text-content text-sm mb-2 group-hover:text-accent transition-colors line-clamp-2 flex-1">
                  {product.name}
                </h2>
                <span className="inline-flex items-center gap-1 text-accent text-xs font-medium mt-2">
                  {t("view_detail")}
                  <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <div className="text-center py-20 text-content-muted">
          <p className="text-4xl mb-4">🔍</p>
          <p>Mahsulot topilmadi</p>
        </div>
      )}
    </div>
  );
}
