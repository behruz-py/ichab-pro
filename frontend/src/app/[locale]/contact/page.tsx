import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { SectionLabel } from "@/components/editorial/SectionLabel";
import { ContactDirectory } from "./ContactDirectory";
import { ContactForm } from "./ContactForm";

type Props = { params: { locale: string } };

const EYEBROW: Record<string, string> = { uz: "Aloqa", ru: "Контакты", en: "Contact" };
const FORM_LABEL: Record<string, string> = { uz: "Murojaat", ru: "Обращение", en: "Inquiry" };

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
  const tf = await getTranslations({ locale, namespace: "footer" });

  const services = await api.services.list(locale).then((r) => r.results).catch(() => []);
  const topics = services.map((s) => s.name);

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-[560px] pointer-events-none" aria-hidden
        style={{ background: "radial-gradient(ellipse 55% 60% at 85% 0%, rgba(var(--accent-rgb),0.12), transparent 70%)" }} />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-28">
        <header className="mb-14 sm:mb-20">
          <SectionLabel index={1} label={EYEBROW[locale] ?? EYEBROW.uz} />
          <h1 className="font-display font-bold leading-[1.02] tracking-[-0.025em]" style={{ fontSize: "clamp(40px,6vw,96px)", color: "var(--content)" }}>
            {t("title")}
          </h1>
          <p className="mt-6 max-w-2xl leading-relaxed" style={{ fontSize: "clamp(16px,1.3vw,19px)", color: "var(--content-secondary)" }}>{t("subtitle")}</p>
        </header>

        <div className="grid lg:grid-cols-12 gap-16 lg:gap-20">
          <div className="lg:col-span-5">
            <ContactDirectory
              locale={locale}
              phones={[tf("phone"), tf("phone2")]}
              fax={tf("fax")}
              email={tf("email")}
              website={tf("website")}
              address={tf("address")}
              hours={tf("hours_value")}
              labels={{
                phone: tf("phone_label"), fax: tf("fax_label"), email: tf("email_label"),
                website: tf("website_label"), address: tf("address_label"), hours: tf("working_hours"),
              }}
            />
          </div>

          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-28">
              <SectionLabel index={2} label={FORM_LABEL[locale] ?? FORM_LABEL.uz} />
              <ContactForm locale={locale} topics={topics} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
