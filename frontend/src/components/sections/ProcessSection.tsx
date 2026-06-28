"use client";

import { motion } from "framer-motion";
import { ClipboardList, Search, Settings, Rocket, type LucideIcon } from "lucide-react";
import { staggerContainer, fadeUp, VIEWPORT } from "@/lib/motion";

const STEP_ICONS: LucideIcon[] = [ClipboardList, Search, Settings, Rocket];

const STEPS: Record<string, { title: string; desc: string }[]> = {
  uz: [
    { title: "Murojaat",         desc: "Bizga murojaat qiling va loyihangiz haqida ma'lumot bering. Konsultatsiya bepul." },
    { title: "Tahlil",            desc: "Mutaxassislarimiz ob'ektni o'rganib, texnik talablarni aniqlaydi." },
    { title: "Ishlab chiqish",    desc: "Moslashtirilgan avtomatika yechimi va texnik loyiha tayyorlanadi." },
    { title: "Ishga tushirish",   desc: "Tizim o'rnatiladi, sozlanadi va to'liq qo'llab-quvvatlanadi." },
  ],
  ru: [
    { title: "Обращение",   desc: "Свяжитесь с нами и расскажите о проекте. Консультация бесплатна." },
    { title: "Анализ",      desc: "Специалисты изучают объект и определяют технические требования." },
    { title: "Разработка",  desc: "Разрабатывается индивидуальное решение и технический проект." },
    { title: "Запуск",      desc: "Система монтируется, настраивается и полностью поддерживается." },
  ],
  en: [
    { title: "Inquiry",     desc: "Contact us and share your project details. Consultation is free." },
    { title: "Analysis",    desc: "Our specialists study the site and identify technical requirements." },
    { title: "Development", desc: "A custom automation solution and technical design are prepared." },
    { title: "Launch",      desc: "The system is installed, configured and fully supported." },
  ],
};

const TITLE: Record<string, string> = {
  uz: "Qanday ishlashimiz",
  ru: "Как мы работаем",
  en: "How We Work",
};
const BADGE: Record<string, string> = {
  uz: "Jarayon",
  ru: "Процесс",
  en: "Process",
};

interface Props { locale: string; }

export function ProcessSection({ locale }: Props) {
  const steps = STEPS[locale] ?? STEPS.uz;
  const title = TITLE[locale] ?? TITLE.uz;
  const badge = BADGE[locale] ?? BADGE.uz;

  return (
    <section className="relative py-24 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "rgba(var(--surface-2-rgb),0.45)" }} />
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(var(--accent-rgb),0.22) 50%,transparent)" }} />
        <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(var(--accent-rgb),0.22) 50%,transparent)" }} />
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(var(--accent-rgb),0.06) 0%, transparent 70%)", filter: "blur(30px)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.20em] mb-3" style={{ color: "var(--accent)" }}>
            {badge}
          </span>
          <h2 className="font-display font-bold text-content" style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}>
            {title}
          </h2>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}
          className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-[42px] left-[12.5%] right-[12.5%] h-px pointer-events-none z-0"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(var(--accent-rgb),0.30) 15%, rgba(var(--accent-rgb),0.30) 85%, transparent 100%)" }} />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="relative z-10"
            >
              <div
                className="group relative p-6 rounded-2xl h-full transition-all duration-350 hover:translate-y-[-4px]"
                style={{
                  background:           "rgba(var(--panel-rgb),0.70)",
                  border:               "1px solid rgba(var(--accent-rgb),0.12)",
                  backdropFilter:       "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  boxShadow:            "0 4px 24px rgba(var(--accent-2-rgb),0.09)",
                }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(var(--accent-rgb),0.10) 0%, transparent 70%)" }} />

                {/* Step icon badge (centered, doubles as connector node) */}
                <div className="flex items-center justify-center mb-5">
                  <div
                    className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center relative"
                    style={{
                      background: "linear-gradient(135deg, rgba(var(--accent-2-rgb),0.70) 0%, rgba(var(--accent-rgb),0.60) 100%)",
                      border:     "1px solid rgba(var(--accent-rgb),0.40)",
                      boxShadow:  "0 0 20px rgba(var(--accent-rgb),0.28), 0 4px 12px rgba(var(--accent-2-rgb),0.10)",
                    }}
                  >
                    {(() => {
                      const Icon = STEP_ICONS[i % STEP_ICONS.length];
                      return <Icon size={24} color="var(--content)" strokeWidth={1.8} />;
                    })()}
                    {/* Step number chip */}
                    <span
                      className="absolute -top-2 -right-2 w-[22px] h-[22px] rounded-full flex items-center justify-center"
                      style={{
                        fontSize: "10px", fontWeight: 800, letterSpacing: "0.02em",
                        color: "var(--content)", fontFamily: "monospace",
                        background: "#0B1733", border: "1px solid rgba(var(--accent-rgb),0.45)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-content text-center mb-2 transition-colors duration-200 group-hover:text-[var(--accent-secondary)]">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-center" style={{ color: "var(--content-secondary)" }}>
                  {step.desc}
                </p>

                {/* Bottom glow on hover */}
                <div className="absolute bottom-0 inset-x-8 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.55), transparent)" }} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
