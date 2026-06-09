import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/request";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { PageTransition } from "@/components/ui/PageTransition";
import { AppLoader } from "@/components/providers/AppLoader";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  if (!locales.includes(locale as Locale)) return {};
  return {
    title: { default: "ICHAB", template: "%s | ICHAB" },
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!locales.includes(locale as Locale)) notFound();

  // Enable static rendering for all pages using this layout
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="noise-overlay">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="midnight"
          themes={["midnight", "light"]}
          enableSystem={false}
          storageKey="ichab-theme"
        >
          <NextIntlClientProvider messages={messages} locale={locale}>
            <QueryProvider>
              <ScrollProgress />
              <AppLoader>
                <Header />
                <PageTransition>
                  <main>{children}</main>
                </PageTransition>
                <Footer />
              </AppLoader>
            </QueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
