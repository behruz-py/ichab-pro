import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind + clsx class merger */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format date for display */
export function formatDate(dateString: string | null, locale: string = "uz"): string {
  if (!dateString) return "";
  const localeMap: Record<string, string> = {
    uz: "uz-UZ",
    ru: "ru-RU",
    en: "en-US",
  };
  return new Date(dateString).toLocaleDateString(localeMap[locale] ?? "uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Build absolute media URL. Returns empty string for null/undefined. */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_MEDIA_URL ?? "http://localhost:8000";
  return `${base}${path}`;
}

/** Clamp text to N characters */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}
