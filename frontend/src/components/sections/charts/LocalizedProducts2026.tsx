"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Boxes, Layers } from "lucide-react";

type Loc = Record<string, string>;
const t = (o: Loc, l: string) => o[l] ?? o.uz;

const HEADING: Loc = {
  uz: "Lokalizatsiya yo'nalishi bo'yicha ishlab chiqariladigan mahsulotlar bashorati",
  ru: "Прогноз производимой продукции по направлению локализации",
  en: "Forecast of products to be manufactured under localization",
};
const HERO: Loc = {
  uz: "ICHAB bo'yicha 2026-yilga mo'ljallangan lokalizatsiyalangan mahsulotlar",
  ru: "Локализованная продукция, запланированная по ICHAB на 2026 год",
  en: "Localized products planned under ICHAB for 2026",
};
const L_TYPES: Loc = { uz: "Mahsulot turi", ru: "Виды продукции", en: "Product types" };
const L_TYPES_U: Loc = { uz: "xil", ru: "видов", en: "types" };
const L_VOL: Loc = { uz: "Mahsulot hajmi", ru: "Объём продукции", en: "Product volume" };
const UNIT: Loc = { uz: "mln so'm", ru: "млн сум", en: "mln UZS" };
const PCS: Loc = { uz: "dona", ru: "шт.", en: "pcs" };

interface P { uz: string; ru: string; en: string; count: string; value: string }
const PRODUCTS: P[] = [
  { uz: "Shaxta reversiv puskateli (ПРР)", ru: "Пускатель рудничный реверсивный", en: "Mine reversible starter (ПРР)", count: "10", value: "278.0" },
  { uz: "Shaxta noreversiv puskateli (ПРН)", ru: "Пускатель рудничный нереверсивный", en: "Mine non-reversible starter (ПРН)", count: "10", value: "192.0" },
  { uz: "Yumshoq ishga tushirish puskateli (ПРМ)", ru: "Пускатель рудничный мягкий пуск", en: "Mine soft-start starter (ПРМ)", count: "6", value: "158.0" },
  { uz: "Qo'lda boshqariladigan puskatel (ПРШ)", ru: "Пускатель рудничный с ручным управлением", en: "Mine manually-operated starter (ПРШ)", count: "6", value: "168.0" },
  { uz: "Shovqin darajasi o'lchagichi (ШУМ-4)", ru: "Измеритель уровня шума", en: "Noise level meter (ШУМ-4)", count: "16", value: "75.0" },
  { uz: "OSM transformatori", ru: "Трансформатор ОСМ", en: "OSM transformer", count: "70", value: "80.0" },
  { uz: "Dvigatelni himoyalash boshqaruv shkafi", ru: "Шкаф управления защиты двигателя", en: "Motor protection control cabinet", count: "45", value: "580.0" },
  { uz: "DIN-reyka", ru: "Дин-рейка", en: "DIN rail", count: "2 777", value: "55.0" },
  { uz: "Quyosh geliokollektori", ru: "Солнечный гелиоколлектор", en: "Solar heat collector", count: "90", value: "700.0" },
  { uz: "Tiristorli boshqaruv shkafi (ВТЕ)", ru: "Шкаф тиристорного управления", en: "Thyristor control cabinet (ВТЕ)", count: "18", value: "2 000.0" },
  { uz: "Kabel uchlari", ru: "Кабельные наконечники", en: "Cable lugs", count: "43 000", value: "500.0" },
  { uz: "ТРЕ 200/460 quvvat bloki", ru: "ТПЕ 200/460 силовой блок", en: "ТРЕ 200/460 power unit", count: "8", value: "730.0" },
  { uz: "Shaxta yoritish moslamasi (АОШ)", ru: "Шахтный осветительный прибор", en: "Mine lighting fixture (АОШ)", count: "6", value: "220.0" },
  { uz: "Avtomatlashtirish shkafi", ru: "Шкаф автоматизации", en: "Automation cabinet", count: "4", value: "330.0" },
  { uz: "Masofadan boshqarish pulti (PDU)", ru: "Пульт дистанционного управления ПДУ", en: "Remote control unit (PDU)", count: "2", value: "65.0" },
  { uz: "Reaktiv quvvatni kompensatsiya qurilmasi", ru: "Устройство компенсации реактивной мощности", en: "Reactive power compensation device", count: "1", value: "40.0" },
  { uz: "Kuch shkafi (ШС)", ru: "Шкаф силовой", en: "Power cabinet (ШС)", count: "2", value: "180.0" },
  { uz: "Titratuvchi boshqarish shkafi", ru: "Шкаф управления вибропитателем", en: "Vibro-feeder control cabinet", count: "10", value: "240.2" },
];

/** Primary (locale-appropriate) name + a secondary reference name — Russian
 * technical designations double as de-facto industry model codes, so we keep
 * one visible as a subtitle unless it would just repeat the primary line. */
function productNames(p: P, locale: string): { primary: string; secondary: string } {
  const primary = locale === "ru" ? p.ru : locale === "en" ? p.en : p.uz;
  const secondary = locale === "ru" ? p.uz : p.ru;
  return { primary, secondary };
}

const PALETTE = ["56,189,248", "139,92,246", "245,158,11", "16,185,129", "236,72,153", "59,130,246"];

function useCountUp(target: number, run: boolean, dur = 1400) {
  const [v, setV] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!run || started.current) return;
    started.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(target); return; }
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

export function LocalizedProducts2026({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const types = useCountUp(18, inView);

  return (
    <section ref={ref}>
      <div className="mb-6">
        <h3 className="font-display font-bold text-content leading-snug" style={{ fontSize: "clamp(19px,2.3vw,26px)" }}>{t(HEADING, locale)}</h3>
      </div>

      {/* Hero summary */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 mb-6" style={{ boxShadow: "var(--card-shadow)", background: "linear-gradient(135deg, rgba(56,189,248,0.10), rgba(52,211,153,0.06)), var(--card-bg)" }}>
        <div className="grid sm:grid-cols-[1fr,auto,auto] gap-6 sm:gap-10 items-center">
          <p className="font-display font-bold text-content" style={{ fontSize: "clamp(16px,1.8vw,20px)" }}>{t(HERO, locale)}</p>
          <div className="flex items-center gap-3">
            <Layers size={28} style={{ color: "var(--accent)" }} />
            <div>
              <div className="font-display font-extrabold tabular-nums leading-none" style={{ fontSize: 34, color: "var(--content)" }}>{types} <span style={{ fontSize: 16, color: "var(--content-secondary)" }}>{t(L_TYPES_U, locale)}</span></div>
              <div className="text-xs mt-1" style={{ color: "var(--content-muted)" }}>{t(L_TYPES, locale)}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Boxes size={28} style={{ color: "rgb(52,211,153)" }} />
            <div>
              <div className="font-display font-extrabold tabular-nums leading-none" style={{ fontSize: 34, color: "var(--content)" }}>6 591.3 <span style={{ fontSize: 14, color: "var(--content-secondary)" }}>{t(UNIT, locale)}</span></div>
              <div className="text-xs mt-1" style={{ color: "var(--content-muted)" }}>{t(L_VOL, locale)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRODUCTS.map((p, i) => {
          const c = PALETTE[i % PALETTE.length];
          const { primary, secondary } = productNames(p, locale);
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.05 + i * 0.03 }}
              whileHover={{ y: -4 }}
              className="group relative glass-card rounded-2xl p-4 flex flex-col"
              style={{ border: `1px solid rgba(${c},0.22)`, boxShadow: "var(--card-shadow)" }}>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: `inset 0 0 0 1.5px rgba(${c},0.5), 0 16px 34px rgba(${c},0.2)` }} />
              <h4 className="font-display font-bold text-content leading-snug" style={{ fontSize: 14 }}>{primary}</h4>
              <p className="mt-0.5 leading-snug" style={{ fontSize: 13.5, color: "var(--content-muted)" }}>{secondary}</p>
              <div className="mt-auto flex items-center justify-between pt-3.5">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg font-bold tabular-nums" style={{ fontSize: 13.5, background: `rgba(${c},0.14)`, color: `rgb(${c})` }}>
                  {p.count} {t(PCS, locale)}
                </span>
                <span className="font-display font-bold tabular-nums" style={{ fontSize: 15, color: "var(--content)" }}>
                  {p.value} <span style={{ fontSize: 12, color: "var(--content-muted)" }}>{t(UNIT, locale)}</span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
