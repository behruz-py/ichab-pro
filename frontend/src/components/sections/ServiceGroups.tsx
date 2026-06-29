"use client";

import { motion } from "framer-motion";
import { Cpu, Wrench, Gauge, Wind, ShieldCheck, KeyRound, Check, type LucideIcon } from "lucide-react";
import { staggerContainer, fadeUp, VIEWPORT } from "@/lib/motion";

type Loc = Record<string, string>;
const tr = (o: Loc, locale: string) => o[locale] ?? o.uz;

const UNIT: Loc = { uz: "xizmat", ru: "услуги", en: "services" };

interface Accent {
  grad: string;   // icon badge gradient
  solid: string;  // check + title hover color
  tint: string;   // check chip bg
  ring: string;   // hover inset ring (rgba)
  glow: string;   // hover outer glow (rgba)
}

interface Group {
  Icon: LucideIcon;
  title: Loc;
  items: Loc[];
  accent: Accent;
}

// Vibrant accent from an rgb triple — badge gradient, accent color, tint, glow.
const mk = (rgb: string): Accent => ({
  grad: `linear-gradient(135deg, rgb(${rgb}) 0%, rgba(${rgb},0.62) 100%)`,
  solid: `rgb(${rgb})`,
  tint: `rgba(${rgb},0.15)`,
  ring: `rgba(${rgb},0.55)`,
  glow: `rgba(${rgb},0.30)`,
});

const A = {
  blue:   mk("59,130,246"),    // automation
  cyan:   mk("6,182,212"),     // repair
  indigo: mk("139,92,246"),    // metrology
  sky:    mk("14,165,233"),    // ventilation
  green:  mk("16,185,129"),    // security
  amber:  mk("245,158,11"),    // turnkey
} satisfies Record<string, Accent>;

const GROUPS: Group[] = [
  {
    Icon: Cpu, accent: A.blue,
    title: { uz: "Avtomatlashtirish va injiniring", ru: "Автоматизация и инжиниринг", en: "Automation & Engineering" },
    items: [
      { uz: "Konstruktorlik hujjatlari va elektr sxemalarini ishlab chiqish", ru: "Разработка конструкторской документации и электрических схем", en: "Design documentation and electrical schematics" },
      { uz: "Avtomatlashtirilgan boshqaruv tizimlari (ASU TP) uchun dasturiy ta'minot ishlab chiqish", ru: "Разработка ПО для автоматизированных систем управления (АСУ ТП)", en: "Software development for automated control systems (ACS)" },
      { uz: "Avtomatlashtirish dasturiy va texnik komplekslarini joriy etish va qo'llab-quvvatlash", ru: "Внедрение и сопровождение программных и технических комплексов автоматизации", en: "Integration and support of automation hardware/software complexes" },
    ],
  },
  {
    Icon: Wrench, accent: A.cyan,
    title: { uz: "Ta'mirlash va sozlash", ru: "Ремонт и наладка", en: "Repair & Commissioning" },
    items: [
      { uz: "Avtomatlashtirilgan elektroprivod va elektroavtomatika tizimlarini ta'mirlash va sozlash", ru: "Ремонт и наладка систем автоматизированного электропривода и электроавтоматики", en: "Repair and commissioning of automated electric drive and electro-automation systems" },
      { uz: "Elektro- va radiotexnik o'lchov vositalarini ta'mirlash", ru: "Ремонт электро- и радиотехнических средств измерений", en: "Repair of electrical and radio measuring instruments" },
      { uz: "Umumtexnik o'lchov vositalarini ta'mirlash (issiqlik-texnika va sarf, bosim, massa va kuch asboblari, gaz-alangali ishlov uskunalari)", ru: "Ремонт средств общетехнических измерений (теплотехники и расхода, давления, массы и силы, газопламенной обработки)", en: "Repair of general technical measuring instruments (thermal & flow, pressure, mass & force, gas-flame processing)" },
    ],
  },
  {
    Icon: Gauge, accent: A.indigo,
    title: { uz: "Metrologiya", ru: "Метрология", en: "Metrology" },
    items: [
      { uz: "Nazorat-o'lchov uskunalari va o'lchov tizimlarini metrologik ta'minlash", ru: "Метрологическое обеспечение контрольно-измерительного оборудования и измерительных систем", en: "Metrological support of instrumentation and measuring systems" },
      { uz: "Ionlashtiruvchi nurlanish o'lchov vositalarini ta'mirlash va tekshirish (verifikatsiya)", ru: "Ремонт и поверка средств измерений ионизирующих излучений", en: "Repair and verification of ionizing radiation measuring instruments" },
    ],
  },
  {
    Icon: Wind, accent: A.sky,
    title: { uz: "Ventilyatsiya va iqlim", ru: "Вентиляция и климат", en: "Ventilation & HVAC" },
    items: [
      { uz: "Texnologik jarayon va xonalarda qo'llaniladigan ventilyatsiya va konditsionerlash tizimlarini sinash va sozlash", ru: "Испытание и наладка систем вентиляции и кондиционирования воздуха в технологических процессах и помещениях", en: "Testing and commissioning of ventilation and air-conditioning systems in processes and facilities" },
    ],
  },
  {
    Icon: ShieldCheck, accent: A.green,
    title: { uz: "Xavfsizlik tizimlari", ru: "Системы безопасности", en: "Security systems" },
    items: [
      { uz: "Qo'riqlash-yong'in signalizatsiyasi (ОПС): montaj, sozlash, texnik xizmat va ta'mir", ru: "Охранно-пожарная сигнализация (ОПС): монтаж, наладка, обслуживание и ремонт", en: "Fire & security alarm (FSA): installation, commissioning, maintenance and repair" },
      { uz: "Videokuzatuv tizimlari: montaj, sozlash, texnik xizmat va ta'mir", ru: "Системы видеонаблюдения: монтаж, наладка, обслуживание и ремонт", en: "Video surveillance systems: installation, commissioning, maintenance and repair" },
      { uz: "Kirishni boshqarish tizimlari (СКУД): montaj, sozlash, texnik xizmat va ta'mir", ru: "Системы контроля и управления доступом (СКУД): монтаж, наладка, обслуживание и ремонт", en: "Access control systems (ACS): installation, commissioning, maintenance and repair" },
    ],
  },
  {
    Icon: KeyRound, accent: A.amber,
    title: { uz: "«Kalit topshirish» loyihalari", ru: "Проекты «под ключ»", en: "Turnkey projects" },
    items: [
      { uz: "Texnologik jarayon va ishlab chiqarishni avtomatlashtirish loyihalarini (ASUTP) «kalit topshirish» asosida ishlab chiqish va joriy etish — bosh pudratchi sifatida", ru: "Разработка и внедрение проектов автоматизации технологических процессов и производств (АСУТП) «под ключ» — генеральный подряд", en: "Development and implementation of turnkey process automation projects (ACS TP) — as general contractor" },
    ],
  },
];

export function ServiceGroups({ locale }: { locale: string }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {GROUPS.map((g, i) => {
        const Icon = g.Icon;
        const a = g.accent;
        return (
          <motion.div
            key={i}
            variants={fadeUp}
            className="group relative flex flex-col rounded-2xl p-6 overflow-hidden transition-transform duration-300 hover:-translate-y-1.5"
            style={{
              background: `linear-gradient(155deg, ${a.tint} 0%, rgba(255,255,255,0) 52%), var(--card-bg)`,
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            {/* Always-on top accent bar */}
            <span className="absolute top-0 inset-x-0 h-[3px]" style={{ background: a.grad }} />

            {/* Floating decorative watermark icon */}
            <motion.div
              className="absolute pointer-events-none"
              style={{ right: -18, bottom: -18 }}
              animate={{ y: [0, -7, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon
                className="transition-all duration-500 group-hover:scale-110 group-hover:opacity-[0.12]"
                style={{ width: 130, height: 130, color: a.solid, opacity: 0.07 }}
                strokeWidth={1}
              />
            </motion.div>

            {/* Hover shine sweep (subtle) */}
            <span className="absolute inset-y-0 left-0 w-1/3 pointer-events-none skew-x-12 -translate-x-[160%] group-hover:translate-x-[420%] transition-transform duration-[900ms] ease-out"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />

            {/* Hover ring + glow */}
            <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ boxShadow: `inset 0 0 0 1px ${a.ring}, 0 18px 44px ${a.glow}` }} />

            {/* Header */}
            <div className="relative flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center rounded-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                style={{ width: 48, height: 48, background: a.grad, boxShadow: `0 8px 20px ${a.glow}` }}>
                <Icon size={24} color="#fff" strokeWidth={1.7} />
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold leading-snug text-content" style={{ fontSize: 16.5 }}>
                  {tr(g.title, locale)}
                </h3>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wide"
                  style={{ background: a.tint, color: a.solid }}>
                  {g.items.length} {tr(UNIT, locale)}
                </span>
              </div>
            </div>

            {/* Checklist */}
            <ul className="relative flex flex-col gap-3">
              {g.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center rounded-md flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110"
                    style={{ width: 18, height: 18, background: a.tint }}>
                    <Check size={12} color={a.solid} strokeWidth={3} />
                  </span>
                  <span className="leading-relaxed" style={{ fontSize: 13.5, color: "var(--content-secondary)" }}>
                    {tr(item, locale)}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
