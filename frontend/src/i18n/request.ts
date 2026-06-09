import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const locales = ["uz", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uz";

export default getRequestConfig(async ({ requestLocale }) => {
  // next-intl 3.22+ pattern: await requestLocale
  const locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) notFound();

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
