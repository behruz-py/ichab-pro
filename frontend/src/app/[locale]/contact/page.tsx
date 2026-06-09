import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { locales } from "@/i18n/request";
import { ContactForm } from "./ContactForm";

type Props = { params: { locale: string } };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title") };
}

export default async function ContactPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-content mb-4">{t("title")}</h1>
        <p className="text-content-secondary text-lg max-w-2xl">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Contact info */}
        <div className="lg:col-span-2 space-y-4">
          {[
            { icon: "⌖", label: "Manzil", value: tFooter("address") },
            { icon: "✆", label: "Telefon", value: tFooter("phone"), href: `tel:${tFooter("phone").replace(/\s/g, "")}` },
            { icon: "@", label: "Email", value: tFooter("email"), href: `mailto:${tFooter("email")}` },
          ].map(({ icon, label, value, href }) => (
            <div key={label} className="glass-card rounded-2xl border border-border-subtle p-5 flex gap-4">
              <span className="text-accent text-xl shrink-0 mt-0.5">{icon}</span>
              <div>
                <p className="text-content-muted text-xs uppercase tracking-wider mb-1">{label}</p>
                {href ? (
                  <a href={href} className="text-content hover:text-accent transition-colors text-sm">
                    {value}
                  </a>
                ) : (
                  <p className="text-content text-sm">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
          <ContactForm locale={locale} />
        </div>
      </div>
    </div>
  );
}
