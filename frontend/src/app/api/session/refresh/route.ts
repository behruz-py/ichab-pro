import { NextResponse, type NextRequest } from "next/server";
import { API_BASE } from "@/lib/api-client";
import { locales } from "@/i18n/request";
import { clearSessionCookies, REFRESH_COOKIE, safeNext, setSessionCookies } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Server components can't write cookies, so an expired access token is
 * renewed here and the visitor is bounced back to the page they asked for. */
export async function GET(req: NextRequest) {
  const next = safeNext(req.nextUrl.searchParams.get("next"), "/uz/internal");
  const seg = next.split("/")[1];
  const locale = (locales as readonly string[]).includes(seg) ? seg : "uz";

  const refresh = req.cookies.get(REFRESH_COOKIE)?.value;
  if (refresh) {
    const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
      cache: "no-store",
    });
    if (res.ok) {
      const out = NextResponse.redirect(new URL(next, req.url));
      setSessionCookies(out, await res.json());
      return out;
    }
  }

  const out = NextResponse.redirect(new URL(`/${locale}/login?next=${encodeURIComponent(next)}`, req.url));
  clearSessionCookies(out);
  return out;
}
