/** Canonical public site URL — used for metadata, sitemap, canonical & hreflang.
 *  Override per-environment with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://frontend-two-beta-39.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "ICHAB";
