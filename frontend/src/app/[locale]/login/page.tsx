import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { safeNext } from "@/lib/session";
import { LoginForm } from "./LoginForm";

type Props = {
  params: { locale: string };
  searchParams: { next?: string; expired?: string };
};

const TITLE: Record<string, string> = { uz: "Xodimlar uchun kirish", ru: "Вход для сотрудников", en: "Staff sign-in" };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  return { title: TITLE[locale] ?? TITLE.uz, robots: { index: false, follow: false } };
}

export default function LoginPage({ params: { locale }, searchParams }: Props) {
  setRequestLocale(locale);
  const next = safeNext(searchParams.next, `/${locale}/internal`);
  return <LoginForm locale={locale} next={next} expired={searchParams.expired === "1"} />;
}
