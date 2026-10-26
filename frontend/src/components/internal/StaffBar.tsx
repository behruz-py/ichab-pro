import Link from "next/link";
import { ShieldCheck, UserCircle2 } from "lucide-react";
import type { StaffUser } from "@/types/internal";
import { LogoutButton } from "./LogoutButton";

type Loc = Record<string, string>;
const LABEL: Loc = { uz: "Ichki bo'lim", ru: "Внутренний раздел", en: "Internal section" };
const NOTE: Loc = { uz: "Faqat xodimlar uchun", ru: "Только для сотрудников", en: "Staff only" };

export function StaffBar({ user, locale }: { user: StaffUser; locale: string }) {
  const t = (o: Loc) => o[locale] ?? o.uz;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 sm:px-5 py-3 mb-10"
      style={{ background: "rgba(var(--accent-rgb),0.07)", border: "1px solid rgba(var(--accent-rgb),0.22)" }}>
      <Link href={`/${locale}/internal`} className="inline-flex items-center gap-2.5">
        <ShieldCheck size={18} style={{ color: "var(--accent)" }} />
        <span className="font-display font-bold text-[15px] text-content">{t(LABEL)}</span>
        <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full font-semibold"
          style={{ background: "rgba(var(--accent-rgb),0.12)", color: "var(--accent)" }}>{t(NOTE)}</span>
      </Link>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--content-secondary)" }}>
          <UserCircle2 size={17} /> {user.full_name}
        </span>
        <LogoutButton locale={locale} />
      </div>
    </div>
  );
}
