import { NextResponse, type NextRequest } from "next/server";
import { API_BASE } from "@/lib/api-client";
import { clearSessionCookies, setSessionCookies } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Staff login: exchanges credentials for a JWT pair and stores it in httpOnly cookies. */
export async function POST(req: NextRequest) {
  let body: { username?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!username || !password) return NextResponse.json({ error: "invalid" }, { status: 400 });

  // Every login reaches the backend from this server's IP; forwarding the
  // visitor's address keeps the backend's per-IP login throttle per person.
  const forwardedFor = req.headers.get("x-forwarded-for") ?? req.ip ?? "";
  const res = await fetch(`${API_BASE}/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(forwardedFor ? { "X-Forwarded-For": forwardedFor } : {}) },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });

  if (res.status === 401) return NextResponse.json({ error: "credentials" }, { status: 401 });
  if (res.status === 429) return NextResponse.json({ error: "throttled" }, { status: 429 });
  if (!res.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });

  const out = NextResponse.json({ ok: true });
  setSessionCookies(out, await res.json());
  return out;
}

export async function DELETE() {
  const out = NextResponse.json({ ok: true });
  clearSessionCookies(out);
  return out;
}
