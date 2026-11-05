"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Package } from "lucide-react";
import type { ProductImage } from "@/types/api";
import { mediaUrl } from "@/lib/utils";
import { resolveIcon } from "@/components/ui/DynamicIcon";

interface Props {
  images: ProductImage[];
  productName: string;
  locale: string;
  noImageText: string;
  rgb: string;
  iconName?: string | null;
}

/** Product "stage": the photo floats over a coloured glow with a soft floor
 * shadow; without photos a large category-icon tile takes its place. */
export function ProductGallery({ images, productName, locale, noImageText, rgb, iconName }: Props) {
  const firstId = (images.find(i => i.is_main) ?? images[0])?.id ?? null;
  const [activeId, setActiveId] = useState<number | null>(firstId);
  const [failed, setFailed] = useState<Set<number>>(new Set());
  const usable = images.filter((i) => !failed.has(i.id));
  const active = usable.find(i => i.id === activeId) ?? usable[0] ?? null;
  const Icon = resolveIcon(iconName) ?? Package;

  const altOf = (img: ProductImage) => ((img[`alt_${locale}` as keyof ProductImage] as string) || img.alt_uz || productName);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-[28px] aspect-square sm:aspect-[5/4]"
        style={{ background: `radial-gradient(ellipse 60% 55% at 50% 45%, rgba(${rgb},0.28), transparent 70%), var(--surface-card)`, border: `1px solid rgba(${rgb},0.2)` }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
          backgroundImage: "linear-gradient(rgba(var(--accent-rgb),0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.07) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 65% 60% at 50% 50%, black, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse 65% 60% at 50% 50%, black, transparent 80%)",
        }} />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[12%] w-1/2 h-8 rounded-[50%] blur-2xl" style={{ background: `rgba(${rgb},0.45)` }} aria-hidden />

        <AnimatePresence mode="wait" initial={false}>
          {active ? (
            <motion.div key={active.id} className="absolute inset-[10%]"
              initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <Image src={mediaUrl(active.image)} alt={altOf(active)} fill priority sizes="(max-width:1024px) 90vw, 45vw"
                onError={() => setFailed((s) => new Set(s).add(active.id))}
                className="object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.28)]" />
            </motion.div>
          ) : (
            <motion.div key="placeholder" className="absolute inset-0 flex flex-col items-center justify-center gap-6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-[40px] flex items-center justify-center rotate-[-6deg]"
                style={{ background: `linear-gradient(145deg, rgb(${rgb}), rgba(${rgb},0.6))`, boxShadow: `0 30px 60px rgba(${rgb},0.35), inset 0 1px 0 rgba(255,255,255,0.35)` }}>
                <Icon size={84} color="#fff" strokeWidth={1.3} />
              </div>
              <span className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--content-muted)" }}>{noImageText}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {usable.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {usable.map(img => {
            const on = img.id === active?.id;
            return (
              <button key={img.id} type="button" onClick={() => setActiveId(img.id)} aria-label={altOf(img)} aria-pressed={on}
                className="relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden transition-all duration-300"
                style={{ background: "var(--surface-card)", border: on ? `2px solid rgb(${rgb})` : "1px solid var(--border)", opacity: on ? 1 : 0.6 }}>
                <Image src={mediaUrl(img.image)} alt={altOf(img)} fill className="object-contain p-2" sizes="80px" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
