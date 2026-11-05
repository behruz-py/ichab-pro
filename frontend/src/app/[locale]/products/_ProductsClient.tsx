"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import type { Availability, Product, ProductCategory } from "@/types/api";
import { EASE } from "@/components/editorial/hooks";
import { ProductCard } from "@/components/products/ProductCard";
import { categoryIdOf, PRODUCT_PALETTE } from "@/components/products/shared";

interface Props {
  products: Product[];
  categories: ProductCategory[];
}

export function ProductsClient({ products, categories }: Props) {
  const locale = useLocale();
  const t = useTranslations("products");
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const catIndex = useMemo(() => new Map(categories.map((c, i) => [c.id, i])), [categories]);
  const catById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const counts = useMemo(() => {
    const m = new Map<number, number>();
    products.forEach((p) => { const id = categoryIdOf(p); if (id != null) m.set(id, (m.get(id) ?? 0) + 1); });
    return m;
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) =>
      (selected == null || categoryIdOf(p) === selected) &&
      (!q || [p.name, p.sku, p.brand, p.short_description].some((v) => v?.toLowerCase().includes(q))));
  }, [products, selected, search]);

  const tabs = [{ id: null as number | null, name: t("filter_all"), count: products.length },
    ...categories.filter((c) => counts.get(c.id)).map((c) => ({ id: c.id as number | null, name: c.name, count: counts.get(c.id) ?? 0 }))];

  return (
    <LayoutGroup>
      {/* Category tabs + search */}
      <div className="flex flex-col lg:flex-row lg:items-end gap-6 mb-4 pb-1" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex gap-x-8 gap-y-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => {
            const on = selected === tab.id;
            return (
              <button key={tab.id ?? "all"} type="button" onClick={() => setSelected(tab.id)} aria-pressed={on}
                className="relative shrink-0 pb-4 text-left transition-colors duration-300">
                <span className="font-display font-semibold whitespace-nowrap" style={{ fontSize: "clamp(16px,1.35vw,20px)", color: on ? "var(--content)" : "var(--content-muted)" }}>
                  {tab.name}
                </span>
                <sup className="ml-1 font-mono text-[11px] font-bold" style={{ color: on ? "var(--accent)" : "var(--content-muted)" }}>{tab.count}</sup>
                {on && <motion.span layoutId="product-tab" className="absolute left-0 right-0 -bottom-px h-[2px]" style={{ background: "var(--hero-accent-gradient)" }} transition={{ duration: 0.45, ease: EASE }} />}
              </button>
            );
          })}
        </div>

        <label className="relative lg:ml-auto lg:w-80 mb-3 block">
          <span className="sr-only">{t("search_placeholder")}</span>
          <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--content-muted)" }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("search_placeholder")}
            className="w-full bg-transparent pl-7 pr-7 py-2 text-[15px] focus:outline-none placeholder:text-[var(--content-muted)]"
            style={{ color: "var(--content)" }} />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="absolute right-0 top-1/2 -translate-y-1/2" aria-label="Clear" style={{ color: "var(--content-muted)" }}>
              <X size={15} />
            </button>
          )}
        </label>
      </div>

      <p className="mb-2 text-sm" style={{ color: "var(--content-muted)" }}>
        <span className="font-mono font-bold" style={{ color: "var(--content)" }}>{filtered.length}</span> {t("results")}
      </p>

      {filtered.length > 0 ? (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-5 gap-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => {
              const cid = categoryIdOf(p);
              const rgb = PRODUCT_PALETTE[(cid != null ? catIndex.get(cid) ?? 0 : 0) % PRODUCT_PALETTE.length];
              const avail = (p.availability ?? "available") as Availability;
              return (
                <motion.div key={p.id} layout
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: EASE }}>
                  <ProductCard product={p} locale={locale} rgb={rgb} availabilityLabel={t(`availability_${avail}`)}
                    iconName={cid != null ? catById.get(cid)?.icon : null} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="py-24 text-center" style={{ borderBottom: "1px solid var(--border)" }}>
          <p className="font-display font-semibold text-xl" style={{ color: "var(--content-secondary)" }}>{t("not_found")}</p>
        </div>
      )}
    </LayoutGroup>
  );
}
