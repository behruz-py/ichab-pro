"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Package } from "lucide-react";
import type { Availability, Product } from "@/types/api";
import { mediaUrl } from "@/lib/utils";
import { resolveIcon } from "@/components/ui/DynamicIcon";
import { AVAIL_RGB } from "./shared";

/** Catalogue card: the product photo (or a tilted category-icon tile) breaks
 * out above the card's top edge. Colour comes from the product's category. */
export const categoryIdOf = (p: Product) =>
  p.category == null ? null : typeof p.category === "number" ? p.category : p.category.id;

export function ProductCard({
  product, locale, rgb, availabilityLabel, iconName,
}: {
  product: Product; locale: string; rgb: string; availabilityLabel: string; iconName?: string | null;
}) {
  const [failed, setFailed] = useState(false);
  const img = failed ? null : product.main_image;
  const Icon = resolveIcon(iconName) ?? Package;
  const avail = (product.availability ?? "available") as Availability;

  return (
    <div className="pt-16 h-full">
      <Link href={`/${locale}/products/${product.slug}`}
        className="group relative flex h-full flex-col rounded-[24px] px-6 pb-6 pt-28 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5"
        style={{
          background: `linear-gradient(180deg, rgba(${rgb},0.16) 0%, rgba(${rgb},0.04) 38%, transparent 70%), var(--surface-card)`,
          border: `1px solid rgba(${rgb},0.22)`,
          boxShadow: "var(--card-shadow)",
        }}>
        <div className="absolute left-1/2 -translate-x-1/2 -top-16 w-[78%] h-40 pointer-events-none">
          <div className="absolute inset-x-[12%] bottom-1 h-6 rounded-[50%] blur-xl transition-all duration-700 group-hover:inset-x-[20%] group-hover:opacity-60"
            style={{ background: `rgba(${rgb},0.55)` }} />
          {img ? (
            <Image src={mediaUrl(img)} alt={product.name} fill sizes="(max-width:640px) 80vw, 300px" onError={() => setFailed(true)}
              className="object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.28)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-3 group-hover:scale-[1.06]" />
          ) : (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-28 h-28 rounded-[28px] flex items-center justify-center rotate-[-6deg] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-3 group-hover:rotate-0"
              style={{ background: `linear-gradient(145deg, rgb(${rgb}), rgba(${rgb},0.6))`, boxShadow: `0 20px 40px rgba(${rgb},0.35), inset 0 1px 0 rgba(255,255,255,0.35)` }}>
              <Icon size={52} color="#fff" strokeWidth={1.4} />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 mb-3 min-w-0">
          {product.sku ? (
            <span className="font-mono text-[12px] font-bold px-2 py-0.5 rounded-md shrink-0" style={{ color: `rgb(${rgb})`, background: `rgba(${rgb},0.12)` }}>
              {product.sku}
            </span>
          ) : <span />}
          {product.category_name && (
            <span className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--content-muted)" }}>
              {product.category_name}
            </span>
          )}
        </div>

        <h3 className="font-display font-semibold leading-snug first-letter:uppercase mb-2" style={{ fontSize: "clamp(16px,1.2vw,19px)", color: "var(--content)" }}>
          {product.name}
        </h3>
        {product.short_description && (
          <p className="text-sm leading-relaxed line-clamp-2 mb-5" style={{ color: "var(--content-secondary)" }}>{product.short_description}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--content-secondary)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: `rgb(${AVAIL_RGB[avail]})`, boxShadow: `0 0 8px rgba(${AVAIL_RGB[avail]},0.7)` }} />
            {availabilityLabel}
          </span>
          <span className="flex items-center justify-center w-9 h-9 rounded-full transition-transform duration-500 group-hover:rotate-45" style={{ background: `rgba(${rgb},0.14)`, color: `rgb(${rgb})` }}>
            <ArrowUpRight size={17} />
          </span>
        </div>
      </Link>
    </div>
  );
}
