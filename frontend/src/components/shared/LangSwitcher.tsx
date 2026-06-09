"use client";

import { useRef, useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { locales, type Locale } from "@/i18n/request";
import { cn } from "@/lib/utils";

const LANG_LABELS: Record<Locale, string> = { uz: "UZ", ru: "RU", en: "EN" };

export function LangSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common.lang");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function switchLocale(newLocale: Locale) {
    if (newLocale === locale) { setOpen(false); return; }
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setOpen(false);
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "flex items-center gap-1.5 px-3 h-8 rounded-lg text-[12px] font-semibold transition-all duration-200",
          "border bg-white/[0.05] backdrop-blur-sm",
          open
            ? "border-accent/45 text-accent bg-accent/8"
            : "border-white/[0.09] text-content-secondary hover:text-content hover:border-white/[0.16] hover:bg-white/[0.08]"
        )}
      >
        {LANG_LABELS[locale]}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-flex"
        >
          <ChevronDown size={12} />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="listbox"
            aria-label="Select language"
            className="absolute right-0 top-full mt-2 w-24 glass-card border border-border-subtle rounded-xl overflow-hidden shadow-xl z-50"
          >
            {locales.map((l) => (
              <button
                key={l}
                role="option"
                aria-selected={locale === l}
                onClick={() => switchLocale(l)}
                title={t(l)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold transition-colors duration-150",
                  locale === l
                    ? "text-accent bg-accent/10"
                    : "text-content-secondary hover:text-content hover:bg-white/5"
                )}
              >
                {LANG_LABELS[l]}
                {locale === l && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
