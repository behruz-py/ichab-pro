"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Search, X, Package } from "lucide-react";
import type { Product, ProductCategory, Availability } from "@/types/api";
import { staggerFast, fadeUp } from "@/lib/motion";

interface Props {
  products: Product[];
  categories: ProductCategory[];
}

const AVAIL_DOT: Record<Availability, string> = {
  available: "16,185,129",
  on_order: "245,158,11",
  discontinued: "148,163,184",
};

export function ProductsClient({ products, categories }: Props) {
  const locale = useLocale();
  const t = useTranslations("products");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"default" | "az" | "za">("default");

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    products.forEach((p) => { const id = p.category?.id; if (id != null) m[id] = (m[id] ?? 0) + 1; });
    return m;
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (selectedCategory) list = list.filter((p) => String(p.category?.id) === selectedCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.sku?.toLowerCase().includes(q) ?? false) ||
        (p.brand?.toLowerCase().includes(q) ?? false) ||
        (p.short_description?.toLowerCase().includes(q) ?? false)
      );
    }
    if (sort !== "default") {
      list = [...list].sort((a, b) => sort === "az" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    }
    return list;
  }, [products, selectedCategory, search, sort]);

  const chip = (active: boolean, c = "var(--accent-rgb)") =>
    active
      ? { background: `rgb(${c === "var(--accent-rgb)" ? "56,189,248" : c})`, color: "#0b1b33", boxShadow: `0 0 16px rgba(56,189,248,0.4)` }
      : { background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--content-secondary)" };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--content-muted)" }} />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("search_placeholder")}
            className="w-full pl-10 pr-9 py-3 rounded-xl text-content text-sm placeholder:text-content-muted focus:outline-none transition-colors"
            style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Clear" style={{ color: "var(--content-muted)" }}>
              <X size={15} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 sm:ml-auto">
          <span className="text-sm tabular-nums whitespace-nowrap" style={{ color: "var(--content-muted)" }}>
            <span className="font-bold text-content">{filtered.length}</span> {t("results")}
          </span>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}
            className="py-2.5 px-3 rounded-xl text-sm text-content focus:outline-none cursor-pointer"
            style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
            <option value="default">{t("sort_default")}</option>
            <option value="az">{t("sort_name_az")}</option>
            <option value="za">{t("sort_name_za")}</option>
          </select>
        </div>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setSelectedCategory("")} className="px-4 py-2 rounded-xl text-sm font-medium transition-all" style={chip(selectedCategory === "")}>
            {t("filter_all")} <span className="opacity-70">· {products.length}</span>
          </button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCategory(String(cat.id))} className="px-4 py-2 rounded-xl text-sm font-medium transition-all" style={chip(selectedCategory === String(cat.id))}>
              {cat.icon && <span className="mr-1">{cat.icon}</span>}
              {cat.name}
              {counts[cat.id] ? <span className="opacity-70"> · {counts[cat.id]}</span> : null}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <motion.div variants={staggerFast} initial="hidden" animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => {
            const avail = (product.availability ?? "available") as Availability;
            return (
              <motion.div key={product.id} variants={fadeUp} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
                <Link href={`/${locale}/products/${product.slug}`}
                  className="group relative flex flex-col h-full rounded-2xl overflow-hidden glass-card transition-colors"
                  style={{ border: "1px solid rgba(56,189,248,0.16)", boxShadow: "var(--card-shadow)" }}>
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "4/3", background: "rgba(255,255,255,0.92)" }}>
                    {product.main_image ? (
                      <Image src={product.main_image} alt={product.name} fill className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ color: "rgba(56,189,248,0.4)" }}>
                        <Package size={42} strokeWidth={1.3} />
                      </div>
                    )}
                    {product.category_name && (
                      <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md" style={{ background: "rgba(11,27,51,0.82)", color: "#7dd3fc" }}>
                        {product.category_name}
                      </span>
                    )}
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full" title={t(`availability_${avail}`)}
                      style={{ background: `rgb(${AVAIL_DOT[avail]})`, boxShadow: `0 0 8px rgba(${AVAIL_DOT[avail]},0.8)` }} />
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="font-display font-semibold text-sm leading-snug mb-1.5 line-clamp-2 text-content group-hover:text-[var(--accent)] transition-colors">
                      {product.name}
                    </h2>
                    {product.short_description ? (
                      <p className="text-xs leading-relaxed mb-3 line-clamp-2 flex-1" style={{ color: "var(--content-secondary)" }}>{product.short_description}</p>
                    ) : <div className="flex-1" />}
                    {(product.sku || product.brand) && (
                      <p className="text-[11px] mb-2.5 truncate" style={{ color: "var(--content-muted)" }}>
                        {product.brand}{product.brand && product.sku ? " · " : ""}{product.sku}
                      </p>
                    )}
                    <span className="text-xs font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200" style={{ color: "var(--accent)" }}>
                      {t("view_detail")} <ArrowRight size={13} />
                    </span>
                  </div>
                  {/* hover ring */}
                  <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ boxShadow: "inset 0 0 0 1.5px rgba(56,189,248,0.5), 0 18px 40px rgba(56,189,248,0.18)" }} />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-4 glass-card rounded-2xl">
          <Search size={44} strokeWidth={1.2} style={{ color: "var(--content-muted)" }} />
          <p style={{ color: "var(--content-muted)" }}>{t("not_found")}</p>
        </div>
      )}
    </>
  );
}
