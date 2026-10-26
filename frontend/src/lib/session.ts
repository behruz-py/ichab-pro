// Server-only: staff session stored as two httpOnly cookies holding the
// backend's JWT pair. The browser never sees the tokens, and internal data
// is fetched server-side, so it never ships in a public JS bundle.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextResponse } from "next/server";
import { API_BASE } from "@/lib/api-client";

export const ACCESS_COOKIE = "ichab_at";
export const REFRESH_COOKIE = "ichab_rt";

// Slightly under the backend lifetimes (60 min / 7 days) so the browser drops
// a cookie before the token inside it expires.
const ACCESS_MAX_AGE = 59 * 60;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 - 60;

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function setSessionCookies(res: NextResponse, tokens: { access: string; refresh?: string }) {
  res.cookies.set(ACCESS_COOKIE, tokens.access, { ...cookieBase, maxAge: ACCESS_MAX_AGE });
  if (tokens.refresh) res.cookies.set(REFRESH_COOKIE, tokens.refresh, { ...cookieBase, maxAge: REFRESH_MAX_AGE });
}

export function clearSessionCookies(res: NextResponse) {
  res.cookies.set(ACCESS_COOKIE, "", { ...cookieBase, maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", { ...cookieBase, maxAge: 0 });
}

/** Only same-site relative paths, so `?next=` can't become an open redirect. */
export function safeNext(next: string | null | undefined, fallback: string): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}

function loginUrl(locale: string, next: string, expired = false) {
  const q = new URLSearchParams({ next });
  if (expired) q.set("expired", "1");
  return `/${locale}/login?${q}`;
}

/** Returns the access token, or redirects to refresh/login. */
export function requireSession(locale: string, path: string): string {
  const store = cookies();
  const access = store.get(ACCESS_COOKIE)?.value;
  if (access) return access;
  if (store.get(REFRESH_COOKIE)) redirect(`/api/session/refresh?next=${encodeURIComponent(path)}`);
  redirect(loginUrl(locale, path));
}

/** Authenticated GET against the backend. A rejected token goes straight to
 * the login page (not to refresh) so a deactivated account can't loop. */
export async function staffFetch<T>(endpoint: string, token: string, locale: string, path: string): Promise<T> {
  const res = await fetch(`${API_BASE}/${endpoint.replace(/^\//, "")}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 401) redirect(loginUrl(locale, path, true));
  if (!res.ok) throw new Error(`Internal API ${res.status}: ${endpoint}`);
  return res.json() as Promise<T>;
}
