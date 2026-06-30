"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, Cpu, Rocket, CalendarRange, Layers, CheckCircle2, type LucideIcon } from "lucide-react";

type Loc = Record<string, string>;
const tr = (o: Loc, l: string) => o[l] ?? o.uz;

type PType = "construction" | "acs" | "implementation";
const TYPE_META: Record<PType, { Icon: LucideIcon; rgb: string; label: Loc }> = {
  construction:   { Icon: Building2, rgb: "245,158,11", label: { uz: "Qurilish va rekonstruksiya", ru: "Строительство и реконструкция", en: "Construction & reconstruction" } },
  acs:            { Icon: Cpu,       rgb: "56,189,248", label: { uz: "ASU TP — avtomatlashtirish", ru: "АСУ ТП — автоматизация", en: "ACS — automation" } },
  implementation: { Icon: Rocket,    rgb: "16,185,129", label: { uz: "Tizimlarni joriy etish", ru: "Внедрение систем", en: "Systems implementation" } },
};
const TYPE_ORDER: PType[] = ["construction", "acs", "implementation"];

const HEADING: Loc = { uz: "Amalga oshirilgan loyihalar", ru: "Реализованные проекты", en: "Completed projects" };
const SUB: Loc = {
  uz: "Kon-metallurgiya sanoati uchun avtomatlashtirish va injiniring bo'yicha bajarilgan ishlar (2017–2022)",
  ru: "Выполненные работы по автоматизации и инжинирингу для горно-металлургической промышленности (2017–2022)",
  en: "Automation and engineering works delivered for the mining & metallurgy industry (2017–2022)",
};
const ALL: Loc = { uz: "Barchasi", ru: "Все", en: "All" };
const K_PROJECTS: Loc = { uz: "Amalga oshirilgan loyiha", ru: "Реализованных проектов", en: "Completed projects" };
const K_PERIOD: Loc = { uz: "Faoliyat davri", ru: "Период работ", en: "Period" };
const K_DIRECTIONS: Loc = { uz: "Asosiy yo'nalish", ru: "Основных направления", en: "Key directions" };

const MONTHS: Record<string, string[]> = {
  uz: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
  ru: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};
function dateLabel(year: number, month: number | undefined, l: string) {
  if (!month) return l === "ru" ? `${year} год` : l === "uz" ? `${year}-yil` : `${year}`;
  const m = (MONTHS[l] ?? MONTHS.uz)[month - 1];
  return l === "uz" ? `${year}-yil, ${m}` : `${m} ${year}`;
}

interface Item { year: number; month?: number; type: PType; uz: string; ru: string; en: string }

const ITEMS: Item[] = [
  { year: 2017, type: "construction", uz: "Aristantau ruda maydoni konlari negizida qazib oluvchi rudnik qurilishi", ru: "Строительство добычного рудника на базе месторождений Аристантауского рудного поля", en: "Construction of a mining pit based on the Aristantau ore-field deposits" },
  { year: 2017, type: "construction", uz: "SevRU «Vostochniy» rudnigi kon-qazib olish majmuasini kengaytirish va rekonstruksiya qilish", ru: "Расширение и реконструкция горнодобывающего комплекса рудника «Восточный» СевРУ", en: "Expansion and reconstruction of the «Vostochny» mine mining complex, SevRU" },
  { year: 2018, type: "construction", uz: "Yer osti portlatish ishlarini ta'minlash uchun emulsion portlovchi moddalar zavodi qurilishi", ru: "Строительство завода эмульсионно-взрывчатых веществ для обеспечения подземных взрывных работ", en: "Construction of an emulsion-explosives plant to support underground blasting operations" },
  { year: 2019, type: "construction", uz: "«Kokpatas» va «Daugiztau» konlarining qiyin boyitiladigan (upor) rudalaridan oltin ajratib olish texnologiyasini takomillashtirish, SevRU", ru: "Усовершенствование технологии извлечения золота из упорных руд месторождений «Кокпатас» и «Даугызтау», СевРУ", en: "Improving the gold-extraction technology from refractory ores of the «Kokpatas» and «Daugyztau» deposits, SevRU" },
  { year: 2019, type: "construction", uz: "Zarmitan oltin rudali zonasi koni negizida kon-ruda majmuasi qurilishi. III bosqich. «Urtalik» («Oraliq») koni", ru: "Строительство горно-рудного комплекса на базе месторождения Зармитанской золоторудной зоны. III этап. Месторождение «Урталик» («Промежуточное»)", en: "Construction of a mining-ore complex based on the Zarmitan gold-ore zone. Stage III. The «Urtalik» («Promezhutochnoye») deposit" },
  { year: 2021, month: 7, type: "acs", uz: "«GMZ-2 qayta ishlash quvvatlarini kengaytirish (I va II bosqich)» loyihasi tarkibida №31 tegirmon bloki ASU TP, CRU", ru: "АСУТП мельничного блока №31 в составе проекта «Расширение перерабатывающих мощностей ГМЗ-2 (I и II этап)», ЦРУ", en: "ACS of milling block No. 31 within the «Expansion of GMZ-2 processing capacities (Stages I & II)» project, CRU" },
  { year: 2021, month: 7, type: "acs", uz: "«GMZ-2 qayta ishlash quvvatlarini kengaytirish» loyihasi tarkibida №32 tegirmon bloki ASU TP, CRU", ru: "АСУТП мельничного блока №32 в составе проекта «Расширение перерабатывающих мощностей ГМЗ-2», ЦРУ", en: "ACS of milling block No. 32 within the «Expansion of GMZ-2 processing capacities» project, CRU" },
  { year: 2020, month: 12, type: "acs", uz: "«Texnogen chiqindilarni qazib olish va qayta ishlash majmuasi qurilishi CKVZ» (GMZ-7) loyihasi tarkibida №2 tegirmon bloki ASU TP, CRU", ru: "АСУТП мельничного блока №2 в составе проекта «Строительство комплекса по добыче и переработке техногенных отходов ЦКВЗ» (ГМЗ-7), ЦРУ", en: "ACS of milling block No. 2 within the «Construction of a technogenic-waste mining & processing complex, TsKVZ» (GMZ-7) project, CRU" },
  { year: 2021, month: 2, type: "acs", uz: "«Auminzo-Amantay ruda maydoni oltin saqlovchi rudalarini qazib olish va qayta ishlash rudnigi qurilishi. GMZ-5 maydonchasi» loyihasi tarkibida №1 tegirmon bloki ASU TP", ru: "АСУТП мельничного блока №1 в составе проекта «Строительство рудника по добыче и переработке золотосодержащих руд месторождений Ауминзо-Амантайского рудного поля. Площадка ГМЗ-5»", en: "ACS of milling block No. 1 within the «Construction of a mine for mining & processing gold-bearing ores of the Auminzo-Amantai ore field. GMZ-5 site» project" },
  { year: 2021, month: 2, type: "acs", uz: "«Auminzo-Amantay ruda maydoni oltin saqlovchi rudalarini qazib olish va qayta ishlash rudnigi qurilishi. GMZ-5 maydonchasi» loyihasi tarkibida №2 tegirmon bloki ASU TP", ru: "АСУТП мельничного блока №2 в составе проекта «Строительство рудника по добыче и переработке золотосодержащих руд месторождений Ауминзо-Амантайского рудного поля. Площадка ГМЗ-5»", en: "ACS of milling block No. 2 within the «Construction of a mine for mining & processing gold-bearing ores of the Auminzo-Amantai ore field. GMZ-5 site» project" },
  { year: 2021, month: 3, type: "acs", uz: "«Texnogen chiqindilarni qazib olish va qayta ishlash majmuasi qurilishi CKVZ» (GMZ-7) loyihasi tarkibida №3 tegirmon bloki ASU TP, CRU", ru: "АСУТП мельничного блока №3 в составе проекта «Строительство комплекса по добыче и переработке техногенных отходов ЦКВЗ» (ГМЗ-7), ЦРУ", en: "ACS of milling block No. 3 within the «Construction of a technogenic-waste mining & processing complex, TsKVZ» (GMZ-7) project, CRU" },
  { year: 2021, month: 3, type: "acs", uz: "«Texnogen chiqindilarni qazib olish va qayta ishlash majmuasi qurilishi CKVZ» (GMZ-7) loyihasi tarkibida №4 tegirmon bloki ASU TP, CRU", ru: "АСУТП мельничного блока №4 в составе проекта «Строительство комплекса по добыче и переработке техногенных отходов ЦКВЗ» (ГМЗ-7), ЦРУ", en: "ACS of milling block No. 4 within the «Construction of a technogenic-waste mining & processing complex, TsKVZ» (GMZ-7) project, CRU" },
  { year: 2021, month: 12, type: "acs", uz: "«Texnogen chiqindilarni qazib olish va qayta ishlash majmuasi qurilishi CKVZ» (GMZ-7) loyihasi tarkibida №5 tegirmon bloki ASU TP, CRU", ru: "АСУТП мельничного блока №5 в составе проекта «Строительство комплекса по добыче и переработке техногенных отходов ЦКВЗ» (ГМЗ-7), ЦРУ", en: "ACS of milling block No. 5 within the «Construction of a technogenic-waste mining & processing complex, TsKVZ» (GMZ-7) project, CRU" },
  { year: 2021, month: 12, type: "acs", uz: "«Texnogen chiqindilarni qazib olish va qayta ishlash majmuasi qurilishi CKVZ» (GMZ-7) loyihasi tarkibida №6 tegirmon bloki ASU TP, CRU", ru: "АСУТП мельничного блока №6 в составе проекта «Строительство комплекса по добыче и переработке техногенных отходов ЦКВЗ» (ГМЗ-7), ЦРУ", en: "ACS of milling block No. 6 within the «Construction of a technogenic-waste mining & processing complex, TsKVZ» (GMZ-7) project, CRU" },
  { year: 2021, month: 10, type: "implementation", uz: "GMZ-1 RU operativ-dispetcherlik boshqaruvining avtomatlashtirilgan tizimini joriy etish", ru: "Внедрение автоматизированной системы оперативно-диспетчерского управления РУ ГМЗ-1", en: "Implementing an automated operational-dispatch control system for RU GMZ-1" },
  { year: 2021, month: 12, type: "implementation", uz: "«Muruntau karyerini o'zlashtirish (V-navbat)» loyihasi doirasida kon-transport majmuasini avtomatlashtirilgan boshqarish tizimini joriy etish, CRU", ru: "Внедрение автоматизированной системы управления горнотранспортным комплексом в рамках проекта «Отработка карьера Мурунтау (V-очередь)», ЦРУ", en: "Implementing an automated control system for the mining-transport complex within the «Muruntau open-pit development (Stage V)» project, CRU" },
  { year: 2021, month: 12, type: "implementation", uz: "Ho'l o'z-o'zidan maydalovchi (MMS) tegirmonlarning ruda bilan to'lish darajasini avtomatik nazorat qilish uchun tovush bosimi darajasini o'lchovchi raqamli tizim, CRU", ru: "Цифровая система измерения уровня звукового давления для автоматического контроля степени заполнения мельниц мокрого самоизмельчения (ММС) руды, ЦРУ", en: "Digital sound-pressure-level measurement system for automatic fill-level control of wet autogenous-grinding (AG) ore mills, CRU" },
  { year: 2022, month: 3, type: "implementation", uz: "«Geologik namunalar uchun konteynerlarni identifikatsiyalash» avtomatlashtirilgan axborot tizimini joriy etish", ru: "Внедрение автоматизированной информационной системы «Идентификация контейнеров для геологических проб»", en: "Implementing the «Identification of containers for geological samples» automated information system" },
  { year: 2022, month: 3, type: "implementation", uz: "№7 gidrometallurgiya zavodi operativ-dispetcherlik boshqaruvining avtomatlashtirilgan tizimini joriy etish, CRU", ru: "Внедрение автоматизированной системы оперативно-диспетчерского управления гидрометаллургического завода №7, ЦРУ", en: "Implementing an automated operational-dispatch control system for Hydrometallurgical Plant No. 7, CRU" },
  { year: 2022, month: 3, type: "construction", uz: "«Texnogen chiqindilarni qazib olish va qayta ishlash majmuasi qurilishi CKVZ» (GMZ-7) loyihasi tarkibida GMZ-7 muhandislik-texnik qo'riqlash vositalari qurilishi, CRU", ru: "Строительство инженерно-технических средств охраны ГМЗ-7 в составе проекта «Строительство комплекса по добыче и переработке техногенных отходов ЦКВЗ» (ГМЗ-7), ЦРУ", en: "Construction of engineering-technical security systems for GMZ-7 within the «Construction of a technogenic-waste mining & processing complex, TsKVZ» (GMZ-7) project, CRU" },
  { year: 2022, month: 3, type: "implementation", uz: "Auminzo-Amantay ruda maydoni №5 gidrometallurgiya zavodi operativ-dispetcherlik boshqaruvining avtomatlashtirilgan tizimini joriy etish", ru: "Внедрение автоматизированной системы оперативно-диспетчерского управления гидрометаллургического завода №5 Ауминзо-Амантайского рудного поля", en: "Implementing an automated operational-dispatch control system for Hydrometallurgical Plant No. 5 of the Auminzo-Amantai ore field" },
];

function useCountUp(target: number, run: boolean, dur = 1400) {
  const [v, setV] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!run || started.current) return;
    started.current = true;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, dur]);
  return v;
}

export function CompletedProjectsTimeline({ locale }: { locale: string }) {
  const [filter, setFilter] = useState<"all" | PType>("all");
  const headRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headRef, { once: true, margin: "-40px" });
  const totalCount = useCountUp(ITEMS.length, inView);

  const typeCounts = useMemo(() => {
    const m: Record<string, number> = {};
    ITEMS.forEach((it) => { m[it.type] = (m[it.type] ?? 0) + 1; });
    return m;
  }, []);

  const groups = useMemo(() => {
    const list = ITEMS.filter((it) => filter === "all" || it.type === filter)
      .slice()
      .sort((a, b) => a.year - b.year || (a.month ?? 0) - (b.month ?? 0));
    const out: { year: number; items: Item[] }[] = [];
    list.forEach((it) => {
      const g = out[out.length - 1];
      if (g && g.year === it.year) g.items.push(it);
      else out.push({ year: it.year, items: [it] });
    });
    return out;
  }, [filter]);

  return (
    <section className="mt-20">
      {/* Header + KPI band */}
      <div ref={headRef} className="mb-10">
        <h2 className="font-display font-bold text-content leading-tight" style={{ fontSize: "clamp(28px,3.6vw,44px)" }}>{tr(HEADING, locale)}</h2>
        <p className="mt-3 max-w-3xl text-base sm:text-lg" style={{ color: "var(--content-secondary)" }}>{tr(SUB, locale)}</p>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8 max-w-2xl">
          {[
            { Icon: CheckCircle2, big: `${totalCount}`, rgb: "56,189,248", label: tr(K_PROJECTS, locale) },
            { Icon: CalendarRange, big: "2017–2022", rgb: "16,185,129", label: tr(K_PERIOD, locale) },
            { Icon: Layers, big: "3", rgb: "245,158,11", label: tr(K_DIRECTIONS, locale) },
          ].map((k, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className="glass-card rounded-2xl p-4 sm:p-5" style={{ border: `1px solid rgba(${k.rgb},0.25)`, boxShadow: "var(--card-shadow)" }}>
              <k.Icon size={20} style={{ color: `rgb(${k.rgb})` }} />
              <div className="font-display font-extrabold tabular-nums mt-2 leading-none" style={{ fontSize: "clamp(20px,2.4vw,30px)", color: "var(--content)" }}>{k.big}</div>
              <div className="text-xs sm:text-[13px] mt-1.5 leading-snug" style={{ color: "var(--content-secondary)" }}>{k.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2.5 mb-12">
        <button onClick={() => setFilter("all")} className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={filter === "all"
            ? { background: "rgb(56,189,248)", color: "#0b1b33", boxShadow: "0 0 16px rgba(56,189,248,0.4)" }
            : { background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--content-secondary)" }}>
          {tr(ALL, locale)} · {ITEMS.length}
        </button>
        {TYPE_ORDER.map((ty) => {
          const m = TYPE_META[ty]; const on = filter === ty;
          return (
            <button key={ty} onClick={() => setFilter(ty)} className="px-4 py-2 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2"
              style={on
                ? { background: `rgb(${m.rgb})`, color: "#0b1b33", boxShadow: `0 0 16px rgba(${m.rgb},0.4)` }
                : { background: "var(--glass)", border: `1px solid rgba(${m.rgb},0.3)`, color: "var(--content-secondary)" }}>
              <m.Icon size={15} /> {tr(m.label, locale)} · {typeCounts[ty]}
            </button>
          );
        })}
      </div>

      {/* Timeline (single rail) */}
      <div className="relative">
        <span className="absolute top-2 bottom-2 w-[2px] left-6" aria-hidden
          style={{ background: "linear-gradient(180deg, transparent, rgba(var(--accent-rgb),0.45) 6%, rgba(var(--accent-rgb),0.45) 94%, transparent)" }} />

        {groups.map((g) => (
          <div key={g.year}>
            {/* year milestone */}
            <div className="relative min-h-12 mb-6 mt-12 first:mt-2 flex items-center">
              <span className="absolute left-0 top-0 w-12 h-12 rounded-full flex items-center justify-center font-display font-extrabold text-[15px] tabular-nums z-10"
                style={{ background: "var(--surface-secondary)", border: "2px solid rgba(var(--accent-rgb),0.6)", color: "var(--accent)", boxShadow: "0 0 18px rgba(var(--accent-rgb),0.35)" }}>
                {g.year}
              </span>
              <span className="ml-16 text-sm font-bold uppercase tracking-wider" style={{ color: "var(--content-muted)" }}>{g.items.length}</span>
            </div>

            {g.items.map((it, idx) => {
              const m = TYPE_META[it.type];
              const text = locale === "ru" ? it.ru : locale === "en" ? it.en : it.uz;
              return (
                <motion.div key={idx} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5 }}
                  className="group relative ml-16 mb-4">
                  <span className="absolute top-7 w-4 h-4 rounded-full z-10" style={{ left: -47, background: `rgb(${m.rgb})`, boxShadow: `0 0 0 4px rgba(${m.rgb},0.18), 0 0 14px rgba(${m.rgb},0.85)` }} aria-hidden />
                  <div className="glass-card rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1"
                    style={{ borderLeft: `3px solid rgb(${m.rgb})`, border: `1px solid rgba(${m.rgb},0.2)`, boxShadow: "var(--card-shadow)" }}>
                    <div className="flex items-start gap-4">
                      <span className="hidden sm:flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0" style={{ background: `rgba(${m.rgb},0.14)`, border: `1px solid rgba(${m.rgb},0.3)` }}>
                        <m.Icon size={22} style={{ color: `rgb(${m.rgb})` }} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2.5">
                          <span className="font-mono text-[12px] font-bold tracking-wide px-2.5 py-1 rounded-md" style={{ background: `rgba(${m.rgb},0.16)`, color: `rgb(${m.rgb})` }}>
                            {dateLabel(it.year, it.month, locale)}
                          </span>
                          <span className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: "var(--content-muted)" }}>{tr(m.label, locale)}</span>
                        </div>
                        <p className="text-[15px] sm:text-base leading-relaxed font-medium text-content">{text}</p>
                      </div>
                    </div>
                    <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ boxShadow: `inset 0 0 0 1.5px rgba(${m.rgb},0.45), 0 18px 40px rgba(${m.rgb},0.16)` }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
