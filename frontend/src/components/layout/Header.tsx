"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LangSwitcher } from "@/components/shared/LangSwitcher";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/utils";
import { LogoBadge } from "@/components/shared/LogoBadge";

const NAV_KEYS = [
  "home", "about", "divisions", "services",
  "products", "projects", "certificates", "partners", "contact",
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

export function Header() {
  const locale            = useLocale();
  const pathname          = usePathname();
  const t                 = useTranslations("nav");
  const { mobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useUIStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname, setMobileMenuOpen]);

  function isActive(key: (typeof NAV_KEYS)[number]) {
    if (key === "home") return pathname === `/${locale}`;
    return pathname.startsWith(`/${locale}${NAV_PATHS[key]}`);
  }

  return (
    <>
      {/* ── Floating pill header ─────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-5 pt-3 sm:pt-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "max-w-[1340px] mx-auto rounded-2xl pointer-events-auto transition-all duration-400",
            scrolled
              ? "shadow-[0_8px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(59,130,246,0.18)]"
              : "shadow-[0_0_0_1px_rgba(59,130,246,0.10)]"
          )}
          style={{
            background: scrolled
              ? "rgba(5,10,23,0.92)"
              : "rgba(5,10,23,0.55)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Blue top accent line */}
          <div
            className={cn("absolute top-0 left-6 right-6 h-px rounded-b-none transition-opacity duration-400", scrolled ? "opacity-60" : "opacity-30")}
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.7) 40%, rgba(96,165,250,0.9) 50%, rgba(59,130,246,0.7) 60%, transparent 100%)" }}
          />

          <div className="px-4 sm:px-5 h-[58px] flex items-center justify-between gap-3">

            {/* ── Logo ────────────────────────────────────────────────────── */}
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2.5 group flex-shrink-0"
              aria-label="ICHAB home"
            >
              <LogoBadge size={30} />
              <div className="hidden sm:flex flex-col leading-none gap-[2px]">
                <span className="font-display font-bold text-[15px] text-content tracking-wide group-hover:text-accent transition-colors duration-200">
                  ICHAB
                </span>
                <span className="text-[9px] text-content-muted font-medium tracking-[0.1em] uppercase">
                  Pro
                </span>
              </div>
            </Link>

            {/* ── Desktop nav ─────────────────────────────────────────────── */}
            <nav className="hidden xl:flex items-center gap-0.5 flex-1 justify-center" aria-label="Main navigation">
              {NAV_KEYS.map((key) => {
                const active = isActive(key);
                return (
                  <Link
                    key={key}
                    href={`/${locale}${NAV_PATHS[key] === "/" ? "" : NAV_PATHS[key]}`}
                    className={cn(
                      "relative px-3 py-1.5 rounded-xl text-[12.5px] font-medium transition-all duration-200 whitespace-nowrap",
                      active
                        ? "text-blue-400"
                        : "text-content-secondary hover:text-content hover:bg-white/[0.05]"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active-bg"
                        className="absolute inset-0 rounded-xl"
                        style={{ background: "rgba(59,130,246,0.10)", border: "1px solid rgba(59,130,246,0.22)" }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{t(key)}</span>
                  </Link>
                );
              })}
            </nav>

            {/* ── Right controls ───────────────────────────────────────────── */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="hidden sm:block">
                <LangSwitcher />
              </div>

              {/* Contact CTA */}
              <Link
                href={`/${locale}/contact`}
                className="hidden lg:inline-flex items-center px-4 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-200 ml-1"
                style={{
                  background: "linear-gradient(135deg, rgba(29,78,216,0.80), rgba(59,130,246,0.85))",
                  border: "1px solid rgba(96,165,250,0.35)",
                  color: "#fff",
                  boxShadow: "0 4px 16px rgba(59,130,246,0.25)",
                }}
              >
                Bog&apos;lanish
              </Link>

              {/* Hamburger */}
              <button
                onClick={toggleMobileMenu}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                className={cn(
                  "xl:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-xl border transition-all duration-200",
                  mobileMenuOpen
                    ? "border-blue-500/40 bg-blue-500/10"
                    : "border-white/[0.08] bg-white/[0.04] hover:border-blue-500/30"
                )}
              >
                <span className={cn("block w-[17px] h-[1.5px] bg-content rounded-full transition-all duration-300 origin-center", mobileMenuOpen && "rotate-45 translate-y-[6.5px]")} />
                <span className={cn("block h-[1.5px] bg-content rounded-full transition-all duration-300", mobileMenuOpen ? "w-0 opacity-0" : "w-[11px] self-end mr-[3px]")} />
                <span className={cn("block w-[17px] h-[1.5px] bg-content rounded-full transition-all duration-300 origin-center", mobileMenuOpen && "-rotate-45 -translate-y-[6.5px]")} />
              </button>
            </div>
          </div>
        </motion.div>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-40 xl:hidden"
              style={{ background: "rgba(5,10,23,0.75)", backdropFilter: "blur(6px)" }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="fixed right-0 top-0 h-full w-[280px] z-50 xl:hidden flex flex-col"
              style={{
                background: "rgba(5,10,23,0.97)",
                backdropFilter: "blur(24px)",
                borderLeft: "1px solid rgba(59,130,246,0.12)",
                boxShadow: "-12px 0 48px rgba(0,0,0,0.55)",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.60) 50%, transparent)" }}
              />

              {/* Drawer header */}
              <div className="h-[72px] flex items-center justify-between px-5 border-b border-white/[0.05]">
                <div className="flex items-center gap-2.5">
                  <LogoBadge size={28} />
                  <span className="font-display font-bold text-[15px] text-content">ICHAB Pro</span>
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

              {/* Drawer nav */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                {NAV_KEYS.map((key, i) => {
                  const active = isActive(key);
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.22 }}
                    >
                      <Link
                        href={`/${locale}${NAV_PATHS[key] === "/" ? "" : NAV_PATHS[key]}`}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 rounded-xl text-[13.5px] font-medium transition-all duration-200",
                          active
                            ? "text-blue-400"
                            : "text-content-secondary hover:text-content hover:bg-white/[0.04]"
                        )}
                        style={active ? { background: "rgba(59,130,246,0.10)", border: "1px solid rgba(59,130,246,0.20)" } : {}}
                      >
                        {t(key)}
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Drawer footer */}
              <div className="px-5 py-5 border-t border-white/[0.05] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-content-muted font-semibold uppercase tracking-[0.1em]">Til</span>
                  <LangSwitcher />
                </div>
                <Link
                  href={`/${locale}/contact`}
                  className="flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
                    boxShadow: "0 4px 16px rgba(59,130,246,0.30)",
                  }}
                >
                  Bog&apos;lanish
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Page spacer */}
      <div className="h-[73px]" aria-hidden="true" />
    </>
  );
}
