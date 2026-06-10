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
  const media = process.env.NEXT_PUBLIC_MEDIA_URL;
  if (media) return `${media.replace(/\/+$/, "")}${path}`;
  // Derive server root from API URL — no separate env var needed
  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
  const base = api.replace(/\/api.*$/, "");
  return `${base}${path}`;
}

/** Clamp text to N characters */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}
