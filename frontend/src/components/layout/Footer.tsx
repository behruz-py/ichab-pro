import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { MapPin, Phone, Mail, Heart } from "lucide-react";
import { LogoBadge } from "@/components/shared/LogoBadge";

const QUICK_LINKS = [
  { key: "about",        path: "/about" },
  { key: "divisions",    path: "/divisions" },
  { key: "services",     path: "/services" },
  { key: "products",     path: "/products" },
  { key: "projects",     path: "/projects" },
  { key: "certificates", path: "/certificates" },
] as const;

export async function Footer() {
  const locale  = await getLocale();
  const tNav    = await getTranslations("nav");
  const tFooter = await getTranslations("footer");
  const year    = new Date().getFullYear();

  return (
    <footer
      className="relative mt-20 overflow-hidden"
      style={{
        background: "rgba(4,8,18,0.95)",
        borderTop: "1px solid rgba(59,130,246,0.10)",
      }}
    >
      {/* Top gradient line */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.45) 30%, rgba(96,165,250,0.65) 50%, rgba(59,130,246,0.45) 70%, transparent 100%)" }}
      />

      {/* Background orb */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none">
        <div className="w-full h-full rounded-full bg-blue-700 blur-[120px] opacity-[0.05]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div>
            <Link href={`/${locale}`} className="flex items-center gap-3 mb-5 group w-fit">
              <LogoBadge size={38} />
              <div className="flex flex-col leading-none gap-1">
                <span className="font-display font-bold text-lg text-content group-hover:text-blue-400 transition-colors">
                  ICHAB Pro
                </span>
                <span className="text-[9px] text-content-muted font-medium uppercase tracking-[0.12em]">
                  Sanoat avtomatizatsiyasi
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#7B93B8" }}>
              {tFooter("description")}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-[0.18em] mb-5"
              style={{ color: "#3B82F6" }}
            >
              {tFooter("quick_links")}
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ key, path }) => (
                <li key={key}>
                  <Link
                    href={`/${locale}${path}`}
                    className="text-sm transition-colors duration-200 inline-flex items-center gap-1.5 group"
                    style={{ color: "#7B93B8" }}
                  >
                    <span
                      className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "#3B82F6" }}
                    />
                    <span className="group-hover:text-blue-400 transition-colors">
                      {tNav(key)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-[0.18em] mb-5"
              style={{ color: "#3B82F6" }}
            >
              {tFooter("contact_info")}
            </h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-sm" style={{ color: "#7B93B8" }}>
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
                <span className="leading-relaxed">{tFooter("address")}</span>
              </li>
              <li>
                <a
                  href={`tel:${tFooter("phone").replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-sm transition-colors duration-200 hover:text-blue-400 group"
                  style={{ color: "#7B93B8" }}
                >
                  <Phone size={16} className="text-blue-500 flex-shrink-0" />
                  {tFooter("phone")}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${tFooter("email")}`}
                  className="flex items-center gap-3 text-sm transition-colors duration-200 hover:text-blue-400"
                  style={{ color: "#7B93B8" }}
                >
                  <Mail size={16} className="text-blue-500 flex-shrink-0" />
                  {tFooter("email")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-xs" style={{ color: "#344768" }}>
            {tFooter("copyright", { year })}
          </p>
          <p className="text-xs" style={{ color: "#344768" }}>
            {tFooter("made_with")}{" "}
            <Heart size={12} fill="#3B82F6" style={{ color: "#3B82F6", display: "inline", verticalAlign: "middle" }} />
          </p>
        </div>
      </div>
    </footer>
  );
}
