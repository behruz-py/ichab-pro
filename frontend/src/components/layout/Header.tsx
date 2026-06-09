"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { LangSwitcher } from "@/components/shared/LangSwitcher";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/utils";
import { LogoBadge } from "@/components/shared/LogoBadge";

const NAV_KEYS = [
  "home",
  "about",
  "divisions",
  "services",
  "products",
  "projects",
  "certificates",
  "partners",
  "contact",
] as const;

const NAV_PATHS: Record<(typeof NAV_KEYS)[number], string> = {
  home:         "/",
  about:        "/about",
  divisions:    "/divisions",
  services:     "/services",
  products:     "/products",
  projects:     "/projects",
  certificates: "/certificates",
  partners:     "/partners",
  contact:      "/contact",
};

const HEADER_H = 68;

export function Header() {
  const locale          = useLocale();
  const pathname        = usePathname();
  const t               = useTranslations("nav");
  const { mobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useUIStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname, setMobileMenuOpen]);

  function isActive(key: (typeof NAV_KEYS)[number]) {
    const path = `/${locale}${NAV_PATHS[key] === "/" ? "" : NAV_PATHS[key]}`;
    if (key === "home") return pathname === `/${locale}`;
    return pathname.startsWith(path);
  }

  return (
    <>
      {/* ── Header bar ─────────────────────────────────────────────────────── */}
      <header
        style={{ height: HEADER_H }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-400",
          scrolled
            ? "bg-surface/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.28)]"
            : "bg-transparent backdrop-blur-none"
        )}
      >
        {/* Teal accent line — appears when scrolled */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 h-px transition-opacity duration-400",
            scrolled ? "opacity-100" : "opacity-0"
          )}
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(1,172,180,0.5) 25%, rgba(4,210,220,0.8) 50%, rgba(1,172,180,0.5) 75%, transparent 100%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">

            {/* ── Logo ─────────────────────────────────────────────────────── */}
            <Link
              href={`/${locale}`}
              className="flex items-center gap-3 group flex-shrink-0"
              aria-label="ICHAB home"
            >
              <LogoBadge size={36} />
              <div className="hidden sm:flex flex-col leading-none gap-[3px]">
                <span className="font-display font-bold text-[17px] text-content tracking-wide group-hover:text-accent transition-colors duration-200">
                  ICHAB
                </span>
                <span className="text-[10px] text-content-muted font-medium tracking-[0.09em] uppercase">
                  Sanoat avtomatizatsiyasi
                </span>
              </div>
            </Link>

            {/* ── Desktop nav ──────────────────────────────────────────────── */}
            <nav
              className="hidden xl:flex items-center gap-0.5"
              aria-label="Main navigation"
            >
              {NAV_KEYS.map((key) => {
                const active = isActive(key);
                return (
                  <Link
                    key={key}
                    href={`/${locale}${NAV_PATHS[key] === "/" ? "" : NAV_PATHS[key]}`}
                    className={cn(
                      "relative px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
                      active
                        ? "text-accent-secondary drop-shadow-[0_0_8px_rgba(4,202,211,0.7)]"
                        : "text-content-secondary hover:text-content hover:bg-white/[0.05]"
                    )}
                  >
                    {t(key)}
                    {/* Animated active dot */}
                    {active && (
                      <motion.span
                        layoutId="nav-active-dot"
                        className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Right controls ───────────────────────────────────────────── */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <LangSwitcher />
                <div className="w-px h-5 bg-border-subtle" />
                <ThemeSwitcher />
              </div>

              {/* Hamburger */}
              <button
                onClick={toggleMobileMenu}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                className={cn(
                  "xl:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px]",
                  "rounded-lg border transition-all duration-200",
                  mobileMenuOpen
                    ? "border-accent/40 bg-accent/8"
                    : "border-white/[0.08] bg-white/[0.04] hover:border-accent/30 hover:bg-white/[0.07]"
                )}
              >
                <span className={cn(
                  "block w-[18px] h-[1.5px] bg-content rounded-full transition-all duration-300 origin-center",
                  mobileMenuOpen && "rotate-45 translate-y-[6.5px]"
                )} />
                <span className={cn(
                  "block h-[1.5px] bg-content rounded-full transition-all duration-300",
                  mobileMenuOpen ? "w-0 opacity-0" : "w-[12px] self-end mr-[3px]"
                )} />
                <span className={cn(
                  "block w-[18px] h-[1.5px] bg-content rounded-full transition-all duration-300 origin-center",
                  mobileMenuOpen && "-rotate-45 -translate-y-[6.5px]"
                )} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ── Mobile menu ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-40 xl:hidden bg-surface/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className={cn(
                "fixed right-0 top-0 h-full w-[280px] z-50 xl:hidden flex flex-col",
                "bg-surface/95 backdrop-blur-2xl",
                "border-l border-white/[0.07]",
                "shadow-[-12px_0_48px_rgba(0,0,0,0.40)]"
              )}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(1,172,180,0.6) 50%, transparent)",
                }}
              />

              {/* Drawer header */}
              <div
                style={{ height: HEADER_H }}
                className="flex items-center justify-between px-5 border-b border-white/[0.06] flex-shrink-0"
              >
                <div className="flex items-center gap-2.5">
                  <LogoBadge size={28} />
                  <span className="font-display font-bold text-[16px] text-content">ICHAB</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-content-muted hover:text-content hover:bg-white/[0.06] transition-all"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Drawer nav links */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                {NAV_KEYS.map((key, i) => {
                  const active = isActive(key);
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.035, duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={`/${locale}${NAV_PATHS[key] === "/" ? "" : NAV_PATHS[key]}`}
                        className={cn(
                          "flex items-center justify-between px-4 py-[11px] rounded-xl text-[13.5px] font-medium transition-all duration-200",
                          active
                            ? "bg-accent/10 text-accent border border-accent/20"
                            : "text-content-secondary hover:text-content hover:bg-white/[0.05]"
                        )}
                      >
                        {t(key)}
                        {active && (
                          <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Drawer footer */}
              <div className="px-5 py-5 border-t border-white/[0.06] space-y-3.5 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-content-muted font-semibold uppercase tracking-[0.1em]">
                    Til
                  </span>
                  <LangSwitcher />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-content-muted font-semibold uppercase tracking-[0.1em]">
                    Mavzu
                  </span>
                  <ThemeSwitcher />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Page spacer */}
      <div style={{ height: HEADER_H }} aria-hidden="true" />
    </>
  );
}
