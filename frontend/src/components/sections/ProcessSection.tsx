"use client";

import { motion } from "framer-motion";
import { ClipboardList, Search, Settings, Rocket, type LucideIcon } from "lucide-react";
import { staggerContainer, fadeUp, VIEWPORT } from "@/lib/motion";

const STEP_ICONS: LucideIcon[] = [ClipboardList, Search, Settings, Rocket];

// Meaningful per-step color (rgb triple for alpha math). The progression
// reads blue → violet → amber → emerald: contact → analyse → build → launch.
const STEP_COLORS = ["59,130,246", "139,92,246", "245,158,11", "16,185,129"];

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
  uz: "Biz qanday ishlaymiz",
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
  const lineGradient = "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.5) 10%, rgba(139,92,246,0.5) 38%, rgba(245,158,11,0.5) 62%, rgba(16,185,129,0.5) 90%, transparent 100%)";

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
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.20em] mb-3" style={{ color: "var(--accent)" }}>
            {badge}
          </span>
          <h2 className="font-display font-bold text-content" style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}>
            {title}
          </h2>
        </motion.div>

        {/* Timeline — a real ordered sequence, so a flowing line + numbered
            nodes carries actual information here (unlike a decorative card
            grid, which would just repeat the same box four times). */}
        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}
          className="relative"
        >
          {/* Desktop: single horizontal line behind the nodes */}
          <div className="hidden lg:block absolute top-7 left-0 right-0 h-px" style={{ background: lineGradient }} />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-6">
            {steps.map((step, i) => {
              const Icon = STEP_ICONS[i % STEP_ICONS.length];
              const c = STEP_COLORS[i % STEP_COLORS.length];
              const isLast = i === steps.length - 1;
              return (
                <motion.div key={i} variants={fadeUp} className="group relative">

                  {/* Mobile/tablet: vertical connector down to the next node */}
                  {!isLast && (
                    <div className="lg:hidden absolute left-7 top-14 bottom-[-40px] w-px"
                      style={{ background: `linear-gradient(180deg, rgba(${c},0.5), rgba(${STEP_COLORS[(i + 1) % STEP_COLORS.length]},0.5))` }} />
                  )}

                  <div className="flex items-start gap-5 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
                    {/* Node — solid fill, so it naturally occludes the
                        connector line passing behind it (no background-color
                        matching needed against the section's translucent tint) */}
                    <div
                      className="relative z-10 flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, rgba(${c},0.95) 0%, rgba(${c},0.60) 100%)`,
                        border:     `1px solid rgba(${c},0.6)`,
                        boxShadow:  `0 0 22px rgba(${c},0.35), inset 0 1px 0 rgba(255,255,255,0.25)`,
                      }}
                    >
                      <Icon size={22} color="#ffffff" strokeWidth={1.9} />
                    </div>

                    {/* Text */}
                    <div className="lg:mt-5 lg:max-w-[220px]">
                      <span className="block font-mono text-[11px] font-bold tracking-widest mb-1" style={{ color: `rgb(${c})` }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display font-bold text-content mb-1.5 transition-colors duration-200" style={{ fontSize: 17 }}>
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--content-secondary)" }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
