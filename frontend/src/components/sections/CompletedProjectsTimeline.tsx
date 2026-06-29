"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type Loc = Record<string, string>;
const tr = (o: Loc, l: string) => o[l] ?? o.uz;

const HEADING: Loc = { uz: "Amalga oshirilgan loyihalar", ru: "Реализованные проекты", en: "Completed projects" };
const SUB: Loc = {
  uz: "Kon-metallurgiya sanoati uchun avtomatlashtirish va injiniring bo'yicha bajarilgan ishlar (2017–2022)",
  ru: "Выполненные работы по автоматизации и инжинирингу для горно-металлургической промышленности (2017–2022)",
  en: "Automation and engineering works delivered for the mining & metallurgy industry (2017–2022)",
};

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

// year → accent colour (rgb triple)
const YEAR_RGB: Record<number, string> = {
  2017: "59,130,246", 2018: "6,182,212", 2019: "139,92,246",
  2020: "245,158,11", 2021: "16,185,129", 2022: "236,72,153",
};

interface Item { year: number; month?: number; uz: string; ru: string; en: string }

const ITEMS: Item[] = [
  { year: 2017, uz: "Aristantau ruda maydoni konlari negizida qazib oluvchi rudnik qurilishi", ru: "Строительство добычного рудника на базе месторождений Аристантауского рудного поля", en: "Construction of a mining pit based on the Aristantau ore-field deposits" },
  { year: 2017, uz: "SevRU «Vostochniy» rudnigi kon-qazib olish majmuasini kengaytirish va rekonstruksiya qilish", ru: "Расширение и реконструкция горнодобывающего комплекса рудника «Восточный» СевРУ", en: "Expansion and reconstruction of the «Vostochny» mine mining complex, SevRU" },
  { year: 2018, uz: "Yer osti portlatish ishlarini ta'minlash uchun emulsion portlovchi moddalar zavodi qurilishi", ru: "Строительство завода эмульсионно-взрывчатых веществ для обеспечения подземных взрывных работ", en: "Construction of an emulsion-explosives plant to support underground blasting operations" },
  { year: 2019, uz: "«Kokpatas» va «Daugiztau» konlarining qiyin boyitiladigan (upor) rudalaridan oltin ajratib olish texnologiyasini takomillashtirish, SevRU", ru: "Усовершенствование технологии извлечения золота из упорных руд месторождений «Кокпатас» и «Даугызтау», СевРУ", en: "Improving the gold-extraction technology from refractory ores of the «Kokpatas» and «Daugyztau» deposits, SevRU" },
  { year: 2019, uz: "Zarmitan oltin rudali zonasi koni negizida kon-ruda majmuasi qurilishi. III bosqich. «Urtalik» («Oraliq») koni", ru: "Строительство горно-рудного комплекса на базе месторождения Зармитанской золоторудной зоны. III этап. Месторождение «Урталик» («Промежуточное»)", en: "Construction of a mining-ore complex based on the Zarmitan gold-ore zone. Stage III. The «Urtalik» («Promezhutochnoye») deposit" },
  { year: 2021, month: 7, uz: "«GMZ-2 qayta ishlash quvvatlarini kengaytirish (I va II bosqich)» loyihasi tarkibida №31 tegirmon bloki ASU TP, CRU", ru: "АСУТП мельничного блока №31 в составе проекта «Расширение перерабатывающих мощностей ГМЗ-2 (I и II этап)», ЦРУ", en: "ACS of milling block No. 31 within the «Expansion of GMZ-2 processing capacities (Stages I & II)» project, CRU" },
  { year: 2021, month: 7, uz: "«GMZ-2 qayta ishlash quvvatlarini kengaytirish» loyihasi tarkibida №32 tegirmon bloki ASU TP, CRU", ru: "АСУТП мельничного блока №32 в составе проекта «Расширение перерабатывающих мощностей ГМЗ-2», ЦРУ", en: "ACS of milling block No. 32 within the «Expansion of GMZ-2 processing capacities» project, CRU" },
  { year: 2020, month: 12, uz: "«Texnogen chiqindilarni qazib olish va qayta ishlash majmuasi qurilishi CKVZ» (GMZ-7) loyihasi tarkibida №2 tegirmon bloki ASU TP, CRU", ru: "АСУТП мельничного блока №2 в составе проекта «Строительство комплекса по добыче и переработке техногенных отходов ЦКВЗ» (ГМЗ-7), ЦРУ", en: "ACS of milling block No. 2 within the «Construction of a technogenic-waste mining & processing complex, TsKVZ» (GMZ-7) project, CRU" },
  { year: 2021, month: 2, uz: "«Auminzo-Amantay ruda maydoni oltin saqlovchi rudalarini qazib olish va qayta ishlash rudnigi qurilishi. GMZ-5 maydonchasi» loyihasi tarkibida №1 tegirmon bloki ASU TP", ru: "АСУТП мельничного блока №1 в составе проекта «Строительство рудника по добыче и переработке золотосодержащих руд месторождений Ауминзо-Амантайского рудного поля. Площадка ГМЗ-5»", en: "ACS of milling block No. 1 within the «Construction of a mine for mining & processing gold-bearing ores of the Auminzo-Amantai ore field. GMZ-5 site» project" },
  { year: 2021, month: 2, uz: "«Auminzo-Amantay ruda maydoni oltin saqlovchi rudalarini qazib olish va qayta ishlash rudnigi qurilishi. GMZ-5 maydonchasi» loyihasi tarkibida №2 tegirmon bloki ASU TP", ru: "АСУТП мельничного блока №2 в составе проекта «Строительство рудника по добыче и переработке золотосодержащих руд месторождений Ауминзо-Амантайского рудного поля. Площадка ГМЗ-5»", en: "ACS of milling block No. 2 within the «Construction of a mine for mining & processing gold-bearing ores of the Auminzo-Amantai ore field. GMZ-5 site» project" },
  { year: 2021, month: 3, uz: "«Texnogen chiqindilarni qazib olish va qayta ishlash majmuasi qurilishi CKVZ» (GMZ-7) loyihasi tarkibida №3 tegirmon bloki ASU TP, CRU", ru: "АСУТП мельничного блока №3 в составе проекта «Строительство комплекса по добыче и переработке техногенных отходов ЦКВЗ» (ГМЗ-7), ЦРУ", en: "ACS of milling block No. 3 within the «Construction of a technogenic-waste mining & processing complex, TsKVZ» (GMZ-7) project, CRU" },
  { year: 2021, month: 3, uz: "«Texnogen chiqindilarni qazib olish va qayta ishlash majmuasi qurilishi CKVZ» (GMZ-7) loyihasi tarkibida №4 tegirmon bloki ASU TP, CRU", ru: "АСУТП мельничного блока №4 в составе проекта «Строительство комплекса по добыче и переработке техногенных отходов ЦКВЗ» (ГМЗ-7), ЦРУ", en: "ACS of milling block No. 4 within the «Construction of a technogenic-waste mining & processing complex, TsKVZ» (GMZ-7) project, CRU" },
  { year: 2021, month: 12, uz: "«Texnogen chiqindilarni qazib olish va qayta ishlash majmuasi qurilishi CKVZ» (GMZ-7) loyihasi tarkibida №5 tegirmon bloki ASU TP, CRU", ru: "АСУТП мельничного блока №5 в составе проекта «Строительство комплекса по добыче и переработке техногенных отходов ЦКВЗ» (ГМЗ-7), ЦРУ", en: "ACS of milling block No. 5 within the «Construction of a technogenic-waste mining & processing complex, TsKVZ» (GMZ-7) project, CRU" },
  { year: 2021, month: 12, uz: "«Texnogen chiqindilarni qazib olish va qayta ishlash majmuasi qurilishi CKVZ» (GMZ-7) loyihasi tarkibida №6 tegirmon bloki ASU TP, CRU", ru: "АСУТП мельничного блока №6 в составе проекта «Строительство комплекса по добыче и переработке техногенных отходов ЦКВЗ» (ГМЗ-7), ЦРУ", en: "ACS of milling block No. 6 within the «Construction of a technogenic-waste mining & processing complex, TsKVZ» (GMZ-7) project, CRU" },
  { year: 2021, month: 10, uz: "GMZ-1 RU operativ-dispetcherlik boshqaruvining avtomatlashtirilgan tizimini joriy etish", ru: "Внедрение автоматизированной системы оперативно-диспетчерского управления РУ ГМЗ-1", en: "Implementing an automated operational-dispatch control system for RU GMZ-1" },
  { year: 2021, month: 12, uz: "«Muruntau karyerini o'zlashtirish (V-navbat)» loyihasi doirasida kon-transport majmuasini avtomatlashtirilgan boshqarish tizimini joriy etish, CRU", ru: "Внедрение автоматизированной системы управления горнотранспортным комплексом в рамках проекта «Отработка карьера Мурунтау (V-очередь)», ЦРУ", en: "Implementing an automated control system for the mining-transport complex within the «Muruntau open-pit development (Stage V)» project, CRU" },
  { year: 2021, month: 12, uz: "Ho'l o'z-o'zidan maydalovchi (MMS) tegirmonlarning ruda bilan to'lish darajasini avtomatik nazorat qilish uchun tovush bosimi darajasini o'lchovchi raqamli tizim, CRU", ru: "Цифровая система измерения уровня звукового давления для автоматического контроля степени заполнения мельниц мокрого самоизмельчения (ММС) руды, ЦРУ", en: "Digital sound-pressure-level measurement system for automatic fill-level control of wet autogenous-grinding (AG) ore mills, CRU" },
  { year: 2022, month: 3, uz: "«Geologik namunalar uchun konteynerlarni identifikatsiyalash» avtomatlashtirilgan axborot tizimini joriy etish", ru: "Внедрение автоматизированной информационной системы «Идентификация контейнеров для геологических проб»", en: "Implementing the «Identification of containers for geological samples» automated information system" },
  { year: 2022, month: 3, uz: "№7 gidrometallurgiya zavodi operativ-dispetcherlik boshqaruvining avtomatlashtirilgan tizimini joriy etish, CRU", ru: "Внедрение автоматизированной системы оперативно-диспетчерского управления гидрометаллургического завода №7, ЦРУ", en: "Implementing an automated operational-dispatch control system for Hydrometallurgical Plant No. 7, CRU" },
  { year: 2022, month: 3, uz: "«Texnogen chiqindilarni qazib olish va qayta ishlash majmuasi qurilishi CKVZ» (GMZ-7) loyihasi tarkibida GMZ-7 muhandislik-texnik qo'riqlash vositalari qurilishi, CRU", ru: "Строительство инженерно-технических средств охраны ГМЗ-7 в составе проекта «Строительство комплекса по добыче и переработке техногенных отходов ЦКВЗ» (ГМЗ-7), ЦРУ", en: "Construction of engineering-technical security systems for GMZ-7 within the «Construction of a technogenic-waste mining & processing complex, TsKVZ» (GMZ-7) project, CRU" },
  { year: 2022, month: 3, uz: "Auminzo-Amantay ruda maydoni №5 gidrometallurgiya zavodi operativ-dispetcherlik boshqaruvining avtomatlashtirilgan tizimini joriy etish", ru: "Внедрение автоматизированной системы оперативно-диспетчерского управления гидрометаллургического завода №5 Ауминзо-Амантайского рудного поля", en: "Implementing an automated operational-dispatch control system for Hydrometallurgical Plant No. 5 of the Auminzo-Amantai ore field" },
];

export function CompletedProjectsTimeline({ locale }: { locale: string }) {
  return (
    <section className="mt-16">
      <div className="mb-10">
        <h2 className="font-display font-bold text-content" style={{ fontSize: "clamp(24px,3vw,38px)" }}>{tr(HEADING, locale)}</h2>
        <p className="mt-3 max-w-2xl" style={{ color: "var(--content-secondary)" }}>{tr(SUB, locale)}</p>
      </div>

      <ol className="relative">
        {/* vertical line */}
        <span className="absolute top-2 bottom-2 w-[2px] left-[19px] lg:left-1/2 lg:-translate-x-1/2"
          style={{ background: "linear-gradient(180deg, transparent, rgba(var(--accent-rgb),0.4) 8%, rgba(var(--accent-rgb),0.4) 92%, transparent)" }} aria-hidden />

        {ITEMS.map((it, i) => {
          const c = YEAR_RGB[it.year];
          const showYear = i === 0 || ITEMS[i - 1].year !== it.year;
          const left = i % 2 === 0;
          const text = locale === "ru" ? it.ru : locale === "en" ? it.en : it.uz;
          return (
            <li key={i}>
              {showYear && (
                <div className="relative flex lg:justify-center py-5">
                  <span className="ml-9 lg:ml-0 relative z-10 inline-flex items-center justify-center px-4 py-1.5 rounded-full font-display font-extrabold text-sm tabular-nums"
                    style={{ background: `rgba(${c},0.16)`, border: `1.5px solid rgba(${c},0.55)`, color: `rgb(${c})`, boxShadow: `0 0 16px rgba(${c},0.3)` }}>
                    {it.year}
                  </span>
                </div>
              )}

              <motion.div className="relative grid lg:grid-cols-2 lg:gap-x-10 py-3"
                initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5 }}>
                {/* node */}
                <span className="absolute z-10 top-7 left-[19px] lg:left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full"
                  style={{ background: `rgb(${c})`, boxShadow: `0 0 0 4px rgba(${c},0.18), 0 0 12px rgba(${c},0.8)` }} aria-hidden />

                <div className={`pl-12 lg:pl-0 ${left ? "lg:col-start-1 lg:pr-12 lg:text-right" : "lg:col-start-2 lg:pl-12"}`}>
                  <div className="group glass-card rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
                    style={{ border: `1px solid rgba(${c},0.22)`, boxShadow: "var(--card-shadow)" }}>
                    <div className={`flex items-center gap-2 mb-2.5 ${left ? "lg:justify-end" : ""}`}>
                      <CheckCircle2 size={15} style={{ color: `rgb(${c})` }} />
                      <span className="font-mono text-[11px] font-bold tracking-wide px-2 py-0.5 rounded-md" style={{ background: `rgba(${c},0.14)`, color: `rgb(${c})` }}>
                        {dateLabel(it.year, it.month, locale)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--content-secondary)" }}>{text}</p>
                  </div>
                </div>
              </motion.div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
