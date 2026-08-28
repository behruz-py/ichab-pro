"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Info, LayoutGrid, Award, Users, ChevronDown, X } from "lucide-react";
import { LangSwitcher } from "@/components/shared/LangSwitcher";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/utils";
import { LogoBadge } from "@/components/shared/LogoBadge";
import { BRAND_NAME, BRAND_FULL_NAME as FULL_NAME } from "@/lib/site";

const CTA_LABEL: Record<string, string> = {
  uz: "Bog'lanish",
  ru: "Связаться",
  en: "Contact us",
};

const DROPDOWN_ITEMS = [
  { key: "about",        path: "/about",        Icon: Info },
  { key: "divisions",    path: "/divisions",    Icon: LayoutGrid },
  { key: "certificates", path: "/certificates", Icon: Award },
  { key: "partners",     path: "/partners",     Icon: Users },
] as const;

const MAIN_NAV = [
  { key: "services",   path: "/services"   },
  { key: "products",   path: "/products"   },
  { key: "projects",   path: "/projects"   },
  { key: "statistics", path: "/statistics" },
  { key: "contact",    path: "/contact"    },
] as const;

export function Header() {
  const locale   = useLocale();
  const pathname = usePathname();
  const t        = useTranslations("nav");
  const tc       = useTranslations("common");
  const { mobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useUIStore();

  const [scrolled,     setScrolled]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hovered,      setHovered]      = useState<string | null>(null);
  const dropdownTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname, setMobileMenuOpen]);

  function isActive(path: string) {
    return pathname.startsWith(`/${locale}${path}`);
  }
  function isDropdownActive() {
    return DROPDOWN_ITEMS.some(item => isActive(item.path));
  }

  function openDropdown()  { clearTimeout(dropdownTimer.current); setDropdownOpen(true); }
  function closeDropdown() { dropdownTimer.current = setTimeout(() => setDropdownOpen(false), 130); }

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "w-full pointer-events-auto transition-all duration-400 relative",
            scrolled ? "shadow-[0_8px_32px_rgba(var(--accent-2-rgb),0.14)]" : ""
          )}
          style={{
            background:           scrolled ? "var(--header-bg-scrolled)" : "var(--header-bg)",
            backdropFilter:       "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderBottom:         `1px solid rgba(var(--accent-rgb),${scrolled ? 0.16 : 0.08})`,
          }}
        >
          {/* Accent glow line along the bottom edge — separates the bar from page content now that it sits flush against the viewport */}
          <div
            className={cn("absolute bottom-0 inset-x-0 h-px transition-opacity duration-400", scrolled ? "opacity-100" : "opacity-50")}
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(var(--accent-rgb),0.7) 40%, rgba(var(--accent-rgb),0.9) 50%, rgba(var(--accent-rgb),0.7) 60%, transparent 100%)" }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between gap-3">

            {/* ── Logo ──────────────────────────────────────────────────── */}
            <Link
              href={`/${locale}`}
              className="flex items-center gap-3 group flex-shrink-0"
              aria-label="ICHAB home"
            >
              <motion.div
                whileHover={{ scale: 1.10, rotate: -6 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
              >
                <LogoBadge size={44} />
              </motion.div>

              <span
                className="hidden sm:block font-display font-bold tracking-[0.08em] transition-all duration-200"
                style={{
                  fontSize: "30px",
                  background: "var(--brand-gradient)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 1px 6px rgba(var(--accent-rgb),0.18))",
                }}
              >
                {BRAND_NAME[locale] ?? "ICHAB"}
              </span>

              {/* ── Full name — current locale only ── */}
              <div className="hidden xl:flex items-stretch gap-3 ml-0.5">
                <div className="w-px self-stretch" style={{ background: "rgba(var(--accent-rgb),0.22)" }} />
                <p
                  className="font-semibold uppercase self-center leading-[1.40]"
                  style={{
                    fontSize: "8px",
                    letterSpacing: "0.07em",
                    color: "rgba(var(--accent-rgb),0.52)",
                    maxWidth: "110px",
                  }}
                >
                  {FULL_NAME[locale] ?? FULL_NAME.uz}
                </p>
              </div>
            </Link>

            {/* ── Desktop nav ───────────────────────────────────────────── */}
            <nav
              className="hidden xl:flex items-center gap-0.5 flex-1 justify-center"
              onMouseLeave={() => setHovered(null)}
              aria-label="Main navigation"
            >

              {/* Kompaniya dropdown trigger */}
              <div
                className="relative"
                onMouseEnter={() => { setHovered("company"); openDropdown(); }}
                onMouseLeave={() => { closeDropdown(); }}
              >
                <button
                  className={cn(
                    "relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[14px] font-medium transition-colors duration-200 whitespace-nowrap",
                    isDropdownActive() || dropdownOpen ? "text-[var(--accent)]" : "text-content-secondary hover:text-content"
                  )}
                >
                  {/* Shared hover pill */}
                  {hovered === "company" && !(isDropdownActive() || dropdownOpen) && (
                    <motion.span
                      layoutId="nav-hover-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: "rgba(var(--accent-rgb),0.07)" }}
                      transition={{ type: "spring", stiffness: 480, damping: 36 }}
                    />
                  )}
                  {/* Open-state subtle bg */}
                  {dropdownOpen && (
                    <span className="absolute inset-0 rounded-xl" style={{ background: "rgba(var(--accent-rgb),0.08)" }} />
                  )}
                  <span className="relative z-10">{t("company")}</span>
                  <motion.span
                    className="relative z-10 flex-shrink-0 inline-flex"
                    animate={{ rotate: dropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <ChevronDown size={13} strokeWidth={2} />
                  </motion.span>
                  {/* Sliding gradient underline — active indicator */}
                  {isDropdownActive() && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-2.5 right-2.5 -bottom-0.5 h-[2.5px] rounded-full"
                      style={{ background: "linear-gradient(90deg, var(--accent) 0%, var(--warm-solid) 100%)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </button>

                {/* Dropdown panel */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0,  scale: 1    }}
                      exit={{    opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      onMouseEnter={openDropdown}
                      onMouseLeave={closeDropdown}
                      className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-56 rounded-2xl z-50 py-2 overflow-hidden"
                      style={{
                        background:           "var(--panel-bg)",
                        backdropFilter:       "blur(28px)",
                        WebkitBackdropFilter: "blur(28px)",
                        border:               "1px solid var(--panel-border)",
                        boxShadow:            "0 16px 56px rgba(0,0,0,0.60), 0 0 0 1px rgba(var(--accent-rgb),0.06)",
                      }}
                    >
                      {/* Top accent line */}
                      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.55) 50%, transparent)" }} />

                      {DROPDOWN_ITEMS.map((item, i) => {
                        const active = isActive(item.path);
                        const Icon = item.Icon;
                        return (
                          <motion.div
                            key={item.key}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.16 }}
                          >
                            <Link
                              href={`/${locale}${item.path}`}
                              className={cn(
                                "flex items-center gap-3 mx-1.5 my-0.5 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-all duration-150 group",
                                active
                                  ? "text-[var(--accent)] bg-blue-500/10"
                                  : "text-content-secondary hover:text-content hover:bg-black/[0.03]"
                              )}
                            >
                              <Icon size={15} style={{ color: active ? "var(--accent)" : "rgba(var(--accent-rgb),0.50)" }} className="flex-shrink-0" />
                              <span className="flex-1">{t(item.key)}</span>
                              {active && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />}
                            </Link>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Standalone nav items */}
              {MAIN_NAV.map(({ key, path }) => {
                const active = isActive(path);
                return (
                  <div
                    key={key}
                    className="relative"
                    onMouseEnter={() => setHovered(key)}
                  >
                    <Link
                      href={`/${locale}${path}`}
                      className={cn(
                        "relative flex items-center px-3.5 py-2 rounded-xl text-[14px] font-medium transition-colors duration-200 whitespace-nowrap",
                        active ? "text-[var(--accent)]" : "text-content-secondary hover:text-content"
                      )}
                    >
                      {/* Shared hover pill — slides between items */}
                      {hovered === key && !active && (
                        <motion.span
                          layoutId="nav-hover-pill"
                          className="absolute inset-0 rounded-xl"
                          style={{ background: "rgba(var(--accent-rgb),0.07)" }}
                          transition={{ type: "spring", stiffness: 480, damping: 36 }}
                        />
                      )}
                      <span className="relative z-10">{t(key)}</span>
                      {/* Sliding gradient underline — active indicator */}
                      {active && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute left-2.5 right-2.5 -bottom-0.5 h-[2.5px] rounded-full"
                          style={{ background: "linear-gradient(90deg, var(--accent) 0%, var(--warm-solid) 100%)" }}
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* ── Right controls ────────────────────────────────────────── */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <ThemeSwitcher className="hidden sm:flex" />
              <div className="hidden sm:block">
                <LangSwitcher />
              </div>

              {/* CTA — pulsing glow */}
              <Link
                href={`/${locale}/contact`}
                className="hidden lg:inline-flex items-center px-5 py-2 rounded-xl text-[15px] font-semibold transition-colors duration-200 ml-1 cta-pulse"
                style={{
                  background: "var(--warm-btn)",
                  border:     "1px solid rgba(var(--warm-glow),0.45)",
                  color:      "#fff",
                }}
              >
                {CTA_LABEL[locale] ?? CTA_LABEL.uz}
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
                    : "border-black/[0.08] bg-black/[0.03] hover:border-blue-500/30"
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
              style={{ background: "rgba(15,23,42,0.40)", backdropFilter: "blur(6px)" }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="fixed right-0 top-0 h-full w-[280px] z-50 xl:hidden flex flex-col"
              style={{
                background:           "var(--panel-bg)",
                backdropFilter:       "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderLeft:           "1px solid var(--panel-border)",
                boxShadow:            "-12px 0 48px rgba(var(--accent-2-rgb),0.16)",
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.60) 50%, transparent)" }} />

              <div className="h-[72px] flex items-center justify-between px-5 border-b border-black/[0.06]">
                <div className="flex items-center gap-3">
                  <LogoBadge size={40} />
                  <span
                    className="font-display font-bold tracking-[0.08em]"
                    style={{
                      fontSize: "20px",
                      background: "var(--brand-gradient)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {BRAND_NAME[locale] ?? "ICHAB"}
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={tc("close")}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-content-muted hover:text-content hover:bg-black/[0.04] transition-all"
                >
                  <X size={14} strokeWidth={2} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-4">
                <div className="mb-3">
                  <p className="px-4 mb-1.5 text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: "rgba(var(--accent-rgb),0.55)" }}>
                    {t("company")}
                  </p>
                  <div className="space-y-0.5">
                    {DROPDOWN_ITEMS.map((item, i) => {
                      const active = isActive(item.path);
                      const Icon = item.Icon;
                      return (
                        <motion.div
                          key={item.key}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.22 }}
                        >
                          <Link
                            href={`/${locale}${item.path}`}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14.5px] font-medium transition-all duration-200",
                              active ? "text-[var(--accent)]" : "text-content-secondary hover:text-content hover:bg-black/[0.03]"
                            )}
                            style={active ? { background: "rgba(var(--accent-rgb),0.10)", border: "1px solid rgba(var(--accent-rgb),0.20)" } : {}}
                          >
                            <Icon size={16} style={{ color: active ? "var(--accent)" : "rgba(var(--accent-rgb),0.45)" }} className="flex-shrink-0" />
                            {t(item.key)}
                            {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="mx-4 my-3 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />

                <div className="space-y-0.5">
                  {MAIN_NAV.map(({ key, path }, i) => {
                    const active = isActive(path);
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (i + DROPDOWN_ITEMS.length) * 0.04, duration: 0.22 }}
                      >
                        <Link
                          href={`/${locale}${path}`}
                          className={cn(
                            "flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200",
                            active ? "text-[var(--accent)]" : "text-content-secondary hover:text-content hover:bg-black/[0.03]"
                          )}
                          style={active ? { background: "rgba(var(--accent-rgb),0.10)", border: "1px solid rgba(var(--accent-rgb),0.20)" } : {}}
                        >
                          {t(key)}
                          {active && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </nav>

              <div className="px-5 py-5 border-t border-black/[0.06] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-content-muted font-semibold uppercase tracking-[0.1em]">Til</span>
                  <div className="flex items-center gap-2">
                    <ThemeSwitcher />
                    <LangSwitcher />
                  </div>
                </div>
                <Link
                  href={`/${locale}/contact`}
                  className="flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "var(--warm-btn)", boxShadow: "0 4px 16px rgba(var(--warm-glow),0.34)" }}
                >
                  {CTA_LABEL[locale] ?? CTA_LABEL.uz}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-[65px]" aria-hidden="true" />
    </>
  );
}
