import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind + clsx class merger */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Manual month tables instead of Intl's toLocaleDateString: the browser's and
// Node's bundled ICU data can disagree on locales like uz-UZ, which produced
// different text server- vs client-side and broke hydration in client
// components. A static lookup renders identically everywhere.
const MONTHS_UZ = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
const MONTHS_RU = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Format date for display */
export function formatDate(dateString: string | null, locale: string = "uz"): string {
  if (!dateString) return "";
  // UTC getters: dateString is a date-only ISO value parsed as UTC midnight,
  // so reading it back in UTC keeps the calendar day independent of the
  // server's or viewer's timezone.
  const d = new Date(dateString);
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  if (locale === "ru") return `${day} ${MONTHS_RU[month]} ${year} г.`;
  if (locale === "en") return `${MONTHS_EN[month]} ${day}, ${year}`;
  return `${day}-${MONTHS_UZ[month]}, ${year}`;
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
