/** Canonical public site URL — used for metadata, sitemap, canonical & hreflang.
 *  Override per-environment with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://frontend-two-beta-39.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "ICHAB";

/** Short brand mark — differs per locale (matches the abbreviation actually
 * used in that language, not a literal translation of "ICHAB"). */
export const BRAND_NAME: Record<string, string> = {
  uz: "ICHAB",
  ru: "УАП",
  en: "MAD",
};

/** Full spelled-out name, per locale. */
export const BRAND_FULL_NAME: Record<string, string> = {
  uz: "ISHLAB CHIQARISHNI AVTOMATLASHTIRISH BOSHQARMASI",
  ru: "УПРАВЛЕНИЕ АВТОМАТИЗАЦИИ ПРОИЗВОДСТВА",
  en: "MANUFACTURING AUTOMATION DEPARTMENT",
};
