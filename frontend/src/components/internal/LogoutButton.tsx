"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const LABEL: Record<string, string> = { uz: "Chiqish", ru: "Выйти", en: "Sign out" };

export function LogoutButton({ locale }: { locale: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/session", { method: "DELETE" }).catch(() => {});
    router.replace(`/${locale}/login`);
    router.refresh();
  }

  return (
    <button onClick={logout} disabled={busy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors duration-200 disabled:opacity-60"
      style={{ background: "rgba(248,113,113,0.10)", border: "1px solid rgba(248,113,113,0.30)", color: "rgb(220,38,38)" }}>
      <LogOut size={14} /> {LABEL[locale] ?? LABEL.uz}
    </button>
  );
}
