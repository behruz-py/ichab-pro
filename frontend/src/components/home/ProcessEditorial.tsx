"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SectionLabel } from "@/components/editorial/SectionLabel";
import { EASE } from "@/components/editorial/hooks";

type Loc = Record<string, string>;
const COLORS = ["59,130,246", "139,92,246", "245,158,11", "16,185,129"];

const TITLE: Loc = { uz: "Biz qanday ishlaymiz", ru: "Как мы работаем", en: "How we work" };
const SUB: Loc = {
  uz: "Murojaatdan ishga tushirishgacha — to'rt aniq bosqich.",
  ru: "От обращения до запуска — четыре чётких этапа.",
  en: "From first inquiry to launch — four clear stages.",
};

const STEPS: Record<string, { title: string; desc: string }[]> = {
  uz: [
    { title: "Murojaat",       desc: "Bizga murojaat qiling va loyihangiz haqida ma'lumot bering. Konsultatsiya bepul." },
    { title: "Tahlil",         desc: "Mutaxassislarimiz ob'ektni o'rganib, texnik talablarni aniqlaydi." },
    { title: "Ishlab chiqish", desc: "Moslashtirilgan avtomatika yechimi va texnik loyiha tayyorlanadi." },
    { title: "Ishga tushirish", desc: "Tizim o'rnatiladi, sozlanadi va to'liq qo'llab-quvvatlanadi." },
  ],
  ru: [
    { title: "Обращение",  desc: "Свяжитесь с нами и расскажите о проекте. Консультация бесплатна." },
    { title: "Анализ",     desc: "Специалисты изучают объект и определяют технические требования." },
    { title: "Разработка", desc: "Разрабатывается индивидуальное решение и технический проект." },
    { title: "Запуск",     desc: "Система монтируется, настраивается и полностью поддерживается." },
  ],
  en: [
    { title: "Inquiry",     desc: "Contact us and share your project details. Consultation is free." },
    { title: "Analysis",    desc: "Our specialists study the site and identify technical requirements." },
    { title: "Development", desc: "A custom automation solution and technical design are prepared." },
    { title: "Launch",      desc: "The system is installed, configured and fully supported." },
  ],
};

function Step({ i, title, desc }: { i: number; title: string; desc: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const c = COLORS[i % COLORS.length];
  const num = String(i + 1).padStart(2, "0");
  return (
    <div ref={ref} className="relative pt-10">
      <span className="absolute top-0 left-0 -translate-y-1/2 w-3 h-3 rounded-full" style={{ background: `rgb(${c})`, boxShadow: `0 0 0 6px rgba(${c},0.15)` }} />
      <span className="relative inline-block font-display font-bold tabular-nums leading-none select-none mb-6" style={{ fontSize: "clamp(64px,6.4vw,104px)" }} aria-hidden>
        <span style={{ WebkitTextStroke: `1.5px rgba(${c},0.55)`, WebkitTextFillColor: "transparent", color: "transparent" }}>{num}</span>
        <motion.span className="absolute inset-0" style={{ color: `rgb(${c})` }}
          initial={{ clipPath: "inset(100% 0 0 0)" }} animate={inView ? { clipPath: "inset(0% 0 0 0)" } : {}}
          transition={{ duration: 1.1, delay: 0.2 + i * 0.15, ease: EASE }}>{num}</motion.span>
      </span>
      <h3 className="font-display font-bold mb-3" style={{ fontSize: "clamp(20px,1.7vw,26px)", color: "var(--content)" }}>{title}</h3>
      <p className="leading-relaxed max-w-xs" style={{ fontSize: 15.5, color: "var(--content-secondary)" }}>{desc}</p>
    </div>
  );
}

export function ProcessEditorial({ index, label, locale }: { index: number; label: string; locale: string }) {
  const steps = STEPS[locale] ?? STEPS.uz;
  const lineRef = useRef<HTMLDivElement>(null);
  const lineInView = useInView(lineRef, { once: true, amount: 0.3 });
  return (
    <section className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <div className="grid lg:grid-cols-12 gap-8 mb-16">
        <div className="lg:col-span-7">
          <SectionLabel index={index} label={label} />
          <h2 className="font-display font-bold leading-[1.05] tracking-[-0.02em]" style={{ fontSize: "clamp(34px,4.2vw,64px)", color: "var(--content)" }}>{TITLE[locale] ?? TITLE.uz}</h2>
        </div>
        <p className="lg:col-span-5 lg:self-end leading-relaxed" style={{ fontSize: 17, color: "var(--content-secondary)" }}>{SUB[locale] ?? SUB.uz}</p>
      </div>

      <div ref={lineRef} className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-14">
        <div className="absolute top-0 inset-x-0 h-px hidden lg:block" style={{ background: "var(--border)" }}>
          <motion.div className="absolute inset-0 origin-left" style={{ background: "linear-gradient(90deg, rgb(59,130,246), rgb(139,92,246), rgb(245,158,11), rgb(16,185,129))" }}
            initial={{ scaleX: 0 }} animate={lineInView ? { scaleX: 1 } : {}} transition={{ duration: 1.6, ease: EASE }} />
        </div>
        {steps.map((s, i) => (
          <div key={i} className="border-t lg:border-t-0" style={{ borderColor: "var(--border)" }}>
            <Step i={i} title={s.title} desc={s.desc} />
          </div>
        ))}
      </div>
    </section>
  );
}
