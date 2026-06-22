"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types/api";

interface Props {
  images: ProductImage[];
  productName: string;
  locale: string;
  noImageText: string;
}

export function ProductGallery({ images, productName, locale, noImageText }: Props) {
  const firstId = (images.find(i => i.is_main) ?? images[0])?.id ?? null;
  const [activeId, setActiveId] = useState<number | null>(firstId);

  const active = images.find(i => i.id === activeId) ?? images[0] ?? null;

  function altOf(img: ProductImage) {
    const key = `alt_${locale}` as keyof ProductImage;
    return (img[key] as string) || img.alt_uz || productName;
  }

  if (!active) {
    return (
      <div
        className="relative rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-3"
        style={{ aspectRatio: "4/3", background: "rgba(247,249,252,0.8)", border: "1px solid rgba(62,106,153,0.14)" }}
      >
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1" style={{ color: "#94A3B8" }}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
        <span className="text-xs" style={{ color: "#94A3B8" }}>{noImageText}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ aspectRatio: "4/3", background: "rgba(247,249,252,0.8)", border: "1px solid rgba(62,106,153,0.14)" }}
      >
        <Image
          src={active.image}
          alt={altOf(active)}
          fill
          className="object-contain"
          sizes="(max-width:1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails — only show if more than 1 image */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map(img => (
            <button
              key={img.id}
              onClick={() => setActiveId(img.id)}
              className="relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-200"
              style={{
                width: "80px",
                height: "60px",
                border: img.id === active.id
                  ? "2px solid rgba(62,106,153,0.70)"
                  : "1px solid rgba(62,106,153,0.20)",
                opacity: img.id === active.id ? 1 : 0.55,
              }}
              aria-label={altOf(img)}
            >
              <Image
                src={img.image}
                alt={altOf(img)}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
