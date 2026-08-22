import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { MapPin, Phone, Mail, Clock, ArrowRight, Printer, Globe } from "lucide-react";
import { LogoBadge } from "@/components/shared/LogoBadge";
import { BRAND_NAME } from "@/lib/site";

const COMPANY = [
  { key: "about",        path: "/about" },
  { key: "divisions",    path: "/divisions" },
  { key: "statistics",   path: "/statistics" },
  { key: "certificates", path: "/certificates" },
  { key: "partners",     path: "/partners" },
] as const;

const CATALOG = [
  { key: "services", path: "/services" },
  { key: "products", path: "/products" },
  { key: "projects", path: "/projects" },
  { key: "contact",  path: "/contact" },
] as const;

const MAP_URL = "https://maps.app.goo.gl/Y4XXTG9fBjgRpwsK6";
const TELEGRAM = "https://t.me/ichab_bot";

function TelegramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.94 4.3 18.6 19.11c-.25 1.1-.92 1.37-1.86.85l-5.13-3.78-2.48 2.39c-.27.27-.5.5-1.03.5l.37-5.26 9.56-8.64c.42-.37-.09-.58-.64-.21L4.99 11.9.71 10.56c-.93-.29-.95-.93.2-1.38l16.74-6.45c.78-.29 1.46.18 1.29 1.57Z" />
    </svg>
  );
}

export async function Footer() {
  const locale  = await getLocale();
  const tNav    = await getTranslations("nav");
  const tFooter = await getTranslations("footer");
  const year    = new Date().getFullYear();

  const address = tFooter("address");
  const phone   = tFooter("phone");
  const email   = tFooter("email");

  const ColHeader = ({ children }: { children: React.ReactNode }) => (
    <h3 className="relative inline-block text-xs font-bold uppercase tracking-[0.18em] mb-6" style={{ color: "var(--accent)" }}>
      {children}
      <span className="absolute -bottom-2.5 left-0 h-0.5 w-8 rounded-full" style={{ background: "var(--accent)", boxShadow: "0 0 8px var(--accent-glow)" }} />
    </h3>
  );

  const NavLink = ({ k, path }: { k: string; path: string }) => (
    <li>
      <Link href={`/${locale}${path}`} className="group inline-flex items-center gap-2 text-sm transition-colors duration-200" style={{ color: "var(--content-secondary)" }}>
        <span className="w-1.5 h-1.5 rounded-full opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" style={{ background: "var(--accent)" }} />
        <span className="group-hover:text-[var(--accent-secondary)] transition-colors">{tNav(k)}</span>
      </Link>
    </li>
  );

  return (
    <footer className="relative mt-20 overflow-hidden" style={{ background: "var(--footer-bg)", borderTop: "1px solid var(--footer-border)" }}>
      {/* Top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(var(--accent-rgb),0.45) 30%, rgba(var(--accent-rgb),0.65) 50%, rgba(var(--accent-rgb),0.45) 70%, transparent 100%)" }} />
      {/* Background orb */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none">
        <div className="w-full h-full rounded-full bg-blue-700 blur-[120px] opacity-[0.05]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">

          {/* Brand + CTA */}
          <div className="lg:col-span-4">
            <Link href={`/${locale}`} className="flex items-center gap-3 mb-5 group w-fit">
              <LogoBadge size={40} />
              <div className="flex flex-col leading-none gap-1">
                <span className="font-display font-bold text-lg text-content group-hover:text-[var(--accent-secondary)] transition-colors">{BRAND_NAME[locale] ?? BRAND_NAME.uz}</span>
                <span className="text-[9px] text-content-muted font-medium uppercase tracking-[0.12em]">Sanoat avtomatizatsiyasi</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--content-secondary)" }}>{tFooter("description")}</p>

            <div className="mt-7">
              <p className="text-sm font-medium mb-3 text-content">{tFooter("cta_text")}</p>
              <Link href={`/${locale}/contact`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                style={{ background: "var(--warm-btn)", boxShadow: "0 8px 22px rgba(var(--warm-glow),0.32)" }}>
                {tFooter("cta_btn")} <ArrowRight size={16} />
              </Link>
            </div>

            {/* Socials */}
            <div className="mt-7 flex items-center gap-3">
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" aria-label="Telegram"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:text-white"
                style={{ background: "rgba(var(--accent-rgb),0.10)", border: "1px solid rgba(var(--accent-rgb),0.28)", color: "var(--accent)" }}>
                <TelegramIcon />
              </a>
            </div>
          </div>

          {/* Company links */}
          <div className="lg:col-span-2">
            <ColHeader>{tFooter("company_col")}</ColHeader>
            <ul className="space-y-3">
              {COMPANY.map(({ key, path }) => <NavLink key={key} k={key} path={path} />)}
            </ul>
          </div>

          {/* Catalog links */}
          <div className="lg:col-span-3">
            <ColHeader>{tFooter("catalog_col")}</ColHeader>
            <ul className="space-y-3">
              {CATALOG.map(({ key, path }) => <NavLink key={key} k={key} path={path} />)}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <ColHeader>{tFooter("contact_info")}</ColHeader>
            <ul className="space-y-4">
              <li>
                <a href={MAP_URL} target="_blank" rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-sm transition-colors duration-200 hover:text-[var(--accent-secondary)]" style={{ color: "var(--content-secondary)" }}>
                  <MapPin size={17} className="mt-0.5 flex-shrink-0 text-[var(--accent)]" />
                  <span className="leading-relaxed">{address}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${phone.replace(/[\s-]/g, "")}`} className="flex items-center gap-3 text-sm transition-colors duration-200 hover:text-[var(--accent-secondary)]" style={{ color: "var(--content-secondary)" }}>
                  <Phone size={17} className="text-[var(--accent)] flex-shrink-0" /> {phone}
                </a>
              </li>
              <li>
                <a href={`tel:${tFooter("phone2").replace(/[\s-]/g, "")}`} className="flex items-center gap-3 text-sm transition-colors duration-200 hover:text-[var(--accent-secondary)]" style={{ color: "var(--content-secondary)" }}>
                  <Phone size={17} className="text-transparent flex-shrink-0" /> {tFooter("phone2")}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: "var(--content-secondary)" }}>
                <Printer size={17} className="text-[var(--accent)] flex-shrink-0" />
                <span><span className="text-content-muted">{tFooter("fax_label")}: </span>{tFooter("fax")}</span>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-3 text-sm transition-colors duration-200 hover:text-[var(--accent-secondary)]" style={{ color: "var(--content-secondary)" }}>
                  <Mail size={17} className="text-[var(--accent)] flex-shrink-0" /> {email}
                </a>
              </li>
              <li>
                <a href="https://www.ngmk.uz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm transition-colors duration-200 hover:text-[var(--accent-secondary)]" style={{ color: "var(--content-secondary)" }}>
                  <Globe size={17} className="text-[var(--accent)] flex-shrink-0" /> {tFooter("website")}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm" style={{ color: "var(--content-secondary)" }}>
                <Clock size={17} className="mt-0.5 text-[var(--accent)] flex-shrink-0" />
                <span><span className="block text-content-muted text-xs">{tFooter("working_hours")}</span>{tFooter("hours_value")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <p className="text-xs" style={{ color: "var(--content-muted)" }}>{tFooter("copyright", { year })}</p>
          <p className="text-xs" style={{ color: "var(--content-muted)" }}>{tFooter("made_with")}</p>
        </div>
      </div>
    </footer>
  );
}
