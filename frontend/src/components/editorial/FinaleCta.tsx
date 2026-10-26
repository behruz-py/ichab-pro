"use client";

import { motion } from "framer-motion";
import { EASE } from "./hooks";
import { MagneticLink } from "./MagneticLink";

type Loc = Record<string, string>;
const T: Record<string, Loc> = {
  eyebrow: { uz: "Hamkorlik", ru: "Сотрудничество", en: "Partnership" },
  line1:   { uz: "Keling, kelajakni", ru: "Давайте строить", en: "Let's build" },
  line2:   { uz: "birga quramiz", ru: "будущее вместе", en: "the future together" },
  text:    { uz: "Loyihangiz uchun ICHAB mutaxassislari bilan bog'laning.", ru: "Свяжитесь со специалистами ICHAB по вашему проекту.", en: "Get in touch with ICHAB specialists about your project." },
  btn:     { uz: "Bog'lanish", ru: "Связаться", en: "Contact us" },
};

export function FinaleCta({ locale }: { locale: string }) {
  const t = (k: string) => T[k][locale] ?? T[k].uz;
  const lines = [t("line1"), t("line2")];
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden
        style={{ background: "radial-gradient(ellipse 50% 45% at 50% 55%, rgba(var(--accent-rgb),0.13), transparent 72%)" }} />
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-40 text-center">
        <span className="inline-block mb-8 text-xs font-bold uppercase tracking-[0.28em]" style={{ color: "var(--accent)" }}>{t("eyebrow")}</span>
        <h2 className="font-display font-bold leading-[0.98] tracking-[-0.03em]" style={{ fontSize: "clamp(42px, 7.6vw, 128px)", color: "var(--content)" }}>
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <motion.span className="inline-block"
                initial={{ y: "105%" }} whileInView={{ y: "0%" }} viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1, delay: i * 0.12, ease: EASE }}
                style={i === 1 ? { background: "var(--hero-accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" } : undefined}>
                {line}
              </motion.span>
            </span>
          ))}
        </h2>
        <p className="mt-8 mb-12 max-w-xl mx-auto leading-relaxed" style={{ fontSize: 18, color: "var(--content-secondary)" }}>{t("text")}</p>
        <MagneticLink href={`/${locale}/contact`}>{t("btn")}</MagneticLink>
      </div>
    </section>
  );
}
