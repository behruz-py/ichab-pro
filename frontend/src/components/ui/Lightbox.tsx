"use client";

import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxItem {
  src: string;
  title?: string;
  subtitle?: string;
}

const iconBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
};

/** Fullscreen image viewer with keyboard + arrow navigation. Reused by the
 * equipment and gallery sections of the lab page. */
export function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const open = index !== null;
  const item = open ? items[index as number] : null;

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onNavigate((index + delta + items.length) % items.length);
    },
    [index, items.length, onNavigate]
  );

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, go]);

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          style={{ background: "rgba(4,12,26,0.92)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={onClose}
            aria-label="Yopish"
            className="absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
            style={iconBtn}
          >
            <X size={20} />
          </button>
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); go(-1); }}
                aria-label="Oldingi"
                className="absolute left-3 sm:left-6 w-11 h-11 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
                style={iconBtn}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); go(1); }}
                aria-label="Keyingi"
                className="absolute right-3 sm:right-6 w-11 h-11 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
                style={iconBtn}
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="relative max-w-5xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full" style={{ aspectRatio: "16/10", maxHeight: "72vh" }}>
              <Image src={item.src} alt={item.title ?? ""} fill className="object-contain rounded-xl" sizes="90vw" />
            </div>
            {(item.title || item.subtitle) && (
              <div className="mt-4 text-center px-4">
                {item.title && <p className="text-white font-semibold">{item.title}</p>}
                {item.subtitle && <p className="text-white/60 text-sm mt-1">{item.subtitle}</p>}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
