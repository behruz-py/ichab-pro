import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { LogoBadge } from "@/components/shared/LogoBadge";

const QUICK_LINKS = [
  { key: "about", path: "/about" },
  { key: "divisions", path: "/divisions" },
  { key: "services", path: "/services" },
  { key: "products", path: "/products" },
  { key: "projects", path: "/projects" },
  { key: "certificates", path: "/certificates" },
] as const;

export async function Footer() {
  const locale = await getLocale();
  const tNav = await getTranslations("nav");
  const tFooter = await getTranslations("footer");

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle bg-surface-secondary/50 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link
              href={`/${locale}`}
              className="flex items-center gap-3 mb-4 group w-fit"
            >
              <LogoBadge size={40} />
              <span className="font-display font-bold text-xl text-content">ICHAB</span>
            </Link>
            <p className="text-content-secondary text-sm leading-relaxed max-w-xs">
              {tFooter("description")}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-content font-semibold mb-4 text-sm uppercase tracking-wider">
              {tFooter("quick_links")}
            </h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map(({ key, path }) => (
                <li key={key}>
                  <Link
                    href={`/${locale}${path}`}
                    className="text-content-secondary hover:text-accent text-sm transition-colors duration-200"
                  >
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-content font-semibold mb-4 text-sm uppercase tracking-wider">
              {tFooter("contact_info")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-content-secondary">
                <span className="text-accent mt-0.5 shrink-0">⌖</span>
                <span>{tFooter("address")}</span>
              </li>
              <li>
                <a
                  href={`tel:${tFooter("phone").replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-sm text-content-secondary hover:text-accent transition-colors"
                >
                  <span className="text-accent">✆</span>
                  {tFooter("phone")}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${tFooter("email")}`}
                  className="flex items-center gap-2 text-sm text-content-secondary hover:text-accent transition-colors"
                >
                  <span className="text-accent">@</span>
                  {tFooter("email")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-content-muted text-xs">
            {tFooter("copyright", { year })}
          </p>
          <p className="text-content-muted text-xs">
            {tFooter("made_with")}{" "}
            <span className="text-accent">♥</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
