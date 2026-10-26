import Link from "next/link";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const LABEL: Record<string, string> = { uz: "Xodimlar uchun kirish", ru: "Вход для сотрудников", en: "Staff sign-in" };

// Points at /internal rather than /login: signed-out staff are redirected to
// the login form, signed-in staff land straight in the internal section.
export function StaffLoginButton({ locale, className }: { locale: string; className?: string }) {
  const label = LABEL[locale] ?? LABEL.uz;
  return (
    <Link
      href={`/${locale}/internal`}
      title={label}
      aria-label={label}
      className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
        "border border-black/[0.08] bg-black/[0.03] backdrop-blur-sm",
        "hover:border-accent/40 hover:bg-accent/[0.08]",
        className
      )}
    >
      <Lock size={15} className="text-accent" />
    </Link>
  );
}
