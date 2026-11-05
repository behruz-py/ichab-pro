import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Globe, Printer } from "lucide-react";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { QuickContacts } from "./QuickContacts";
import { ContactForm } from "./ContactForm";

type Props = { params: { locale: string } };
type Loc = Record<string, string>;

const FORM_TITLE: Loc = { uz: "Ariza qoldiring", ru: "Оставьте заявку", en: "Leave a request" };
const FORM_TEXT: Loc = {
  uz: "Formani to'ldiring — mutaxassislarimiz siz bilan bog'lanib, loyihangizni muhokama qiladi. Ism va telefon yoki emaildan birini kiritish kifoya.",
  ru: "Заполните форму — наши специалисты свяжутся с вами и обсудят ваш проект. Достаточно указать имя и телефон или email.",
  en: "Fill in the form and our specialists will get in touch to discuss your project. Your name and a phone number or email are enough.",
};

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
  const tr = (o: Loc) => o[locale] ?? o.uz;

  const services = await api.services.list(locale).then((r) => r.results).catch(() => []);
  const topics = services.map((s) => s.name);

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-[560px] pointer-events-none" aria-hidden
        style={{ background: "radial-gradient(ellipse 55% 60% at 85% 0%, rgba(var(--accent-rgb),0.12), transparent 70%)" }} />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-28">
        <header className="mb-12 sm:mb-16">
          <h1 className="font-display font-bold leading-[1.02] tracking-[-0.025em]" style={{ fontSize: "clamp(40px,6vw,96px)", color: "var(--content)" }}>
            {t("title")}
          </h1>
          <p className="mt-6 max-w-2xl leading-relaxed" style={{ fontSize: "clamp(16px,1.3vw,19px)", color: "var(--content-secondary)" }}>{t("subtitle")}</p>
        </header>

        <QuickContacts locale={locale} phones={[tf("phone"), tf("phone2")]} email={tf("email")} address={tf("address")} hours={tf("hours_value")} />

        <section className="grid lg:grid-cols-12 gap-12 lg:gap-20 mt-20 sm:mt-28">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="font-display font-bold leading-[1.05] tracking-[-0.02em]" style={{ fontSize: "clamp(32px,3.4vw,52px)", color: "var(--content)" }}>{tr(FORM_TITLE)}</h2>
              <p className="mt-5 leading-relaxed max-w-sm" style={{ fontSize: 17, color: "var(--content-secondary)" }}>{tr(FORM_TEXT)}</p>
              <dl className="mt-10 space-y-3 text-sm" style={{ color: "var(--content-secondary)" }}>
                <div className="flex items-center gap-3">
                  <Printer size={15} style={{ color: "var(--content-muted)" }} />
                  <dt className="sr-only">{tf("fax_label")}</dt>
                  <dd>{tf("fax_label")}: <span className="tabular-nums" style={{ color: "var(--content)" }}>{tf("fax")}</span></dd>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={15} style={{ color: "var(--content-muted)" }} />
                  <dt className="sr-only">{tf("website_label")}</dt>
                  <dd><a href={`https://${tf("website")}`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--accent)]" style={{ color: "var(--content)" }}>{tf("website")}</a></dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ContactForm locale={locale} topics={topics} />
          </div>
        </section>
      </div>
    </div>
  );
}
