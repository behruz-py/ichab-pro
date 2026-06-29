"use client";

import { motion } from "framer-motion";
import { ClipboardList, Search, Settings, Rocket, ChevronRight, type LucideIcon } from "lucide-react";
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
          {/* Connector line (desktop only) — multi-color, ties the step hues */}
          <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px pointer-events-none z-0"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.45) 14%, rgba(139,92,246,0.45) 42%, rgba(245,158,11,0.45) 64%, rgba(16,185,129,0.45) 86%, transparent 100%)" }} />

          {steps.map((step, i) => {
            const Icon = STEP_ICONS[i % STEP_ICONS.length];
            const c = STEP_COLORS[i % STEP_COLORS.length];
            const isLast = i === steps.length - 1;
            return (
            <motion.div
              key={i}
              variants={fadeUp}
              className="relative z-10"
              style={{ "--step": `rgb(${c})` } as React.CSSProperties}
            >
              {/* Directional arrow into the next step (desktop) */}
              {!isLast && (
                <div className="hidden lg:flex absolute top-[39px] -right-[15px] z-20 w-[26px] h-[26px] items-center justify-center rounded-full pointer-events-none"
                  style={{ background: "var(--surface)", border: `1px solid rgba(${c},0.45)` }}>
                  <ChevronRight size={15} style={{ color: `rgb(${c})` }} />
                </div>
              )}

              <div
                className="group relative p-6 rounded-2xl h-full overflow-hidden transition-all duration-300 hover:translate-y-[-6px]"
                style={{
                  background:           "rgba(var(--panel-rgb),0.70)",
                  border:               `1px solid rgba(${c},0.16)`,
                  backdropFilter:       "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  boxShadow:            "0 4px 24px rgba(var(--accent-2-rgb),0.09)",
                }}
              >
                {/* Colored border ring + lift shadow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1.5px rgba(${c},0.55), 0 18px 40px rgba(${c},0.22)` }} />

                {/* Big ghost step number (in the step's color) */}
                <span
                  className="absolute -top-1 right-3 font-display font-extrabold pointer-events-none select-none leading-none transition-all duration-300 group-hover:scale-110"
                  style={{ fontSize: 70, color: `rgba(${c},0.12)` }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Top accent line in the step color */}
                <div className="absolute top-0 inset-x-10 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, rgba(${c},0.55), transparent)` }} />

                {/* Hover glow in the step color */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, rgba(${c},0.16) 0%, transparent 70%)` }} />

                {/* Step icon badge (centered, sits on the connector) */}
                <div className="relative flex items-center justify-center mb-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center relative transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                    style={{
                      background: `linear-gradient(135deg, rgba(${c},0.95) 0%, rgba(${c},0.55) 100%)`,
                      border:     `1px solid rgba(${c},0.5)`,
                      boxShadow:  `0 0 26px rgba(${c},0.40), inset 0 1px 0 rgba(255,255,255,0.28)`,
                    }}
                  >
                    <Icon size={26} color="#ffffff" strokeWidth={1.9} />
                  </div>
                </div>

                <h3 className="relative font-display font-bold text-content text-center mb-2 transition-colors duration-200 group-hover:text-[color:var(--step)]">
                  {step.title}
                </h3>
                <p className="relative text-sm leading-relaxed text-center" style={{ color: "var(--content-secondary)" }}>
                  {step.desc}
                </p>

                {/* Bottom glow on hover */}
                <div className="absolute bottom-0 inset-x-8 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: `linear-gradient(90deg, transparent, rgba(${c},0.7), transparent)` }} />
              </div>
            </motion.div>
          );})}
        </motion.div>
      </div>
    </section>
  );
}
