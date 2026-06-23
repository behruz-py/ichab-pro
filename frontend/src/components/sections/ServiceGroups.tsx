import { Cpu, Wrench, Gauge, Wind, ShieldCheck, KeyRound, Check, type LucideIcon } from "lucide-react";

type Loc = Record<string, string>;
const tr = (o: Loc, locale: string) => o[locale] ?? o.uz;

interface Group {
  Icon: LucideIcon;
  title: Loc;
  items: Loc[];
}

const GROUPS: Group[] = [
  {
    Icon: Cpu,
    title: { uz: "Avtomatlashtirish va injiniring", ru: "Автоматизация и инжиниринг", en: "Automation & Engineering" },
    items: [
      { uz: "Konstruktorlik hujjatlari va elektr sxemalarini ishlab chiqish", ru: "Разработка конструкторской документации и электрических схем", en: "Design documentation and electrical schematics" },
      { uz: "Avtomatlashtirilgan boshqaruv tizimlari (ASU TP) uchun dasturiy ta'minot ishlab chiqish", ru: "Разработка ПО для автоматизированных систем управления (АСУ ТП)", en: "Software development for automated control systems (ACS)" },
      { uz: "Avtomatlashtirish dasturiy va texnik komplekslarini joriy etish va qo'llab-quvvatlash", ru: "Внедрение и сопровождение программных и технических комплексов автоматизации", en: "Integration and support of automation hardware/software complexes" },
    ],
  },
  {
    Icon: Wrench,
    title: { uz: "Ta'mirlash va sozlash", ru: "Ремонт и наладка", en: "Repair & Commissioning" },
    items: [
      { uz: "Avtomatlashtirilgan elektroprivod va elektroavtomatika tizimlarini ta'mirlash va sozlash", ru: "Ремонт и наладка систем автоматизированного электропривода и электроавтоматики", en: "Repair and commissioning of automated electric drive and electro-automation systems" },
      { uz: "Elektro- va radiotexnik o'lchov vositalarini ta'mirlash", ru: "Ремонт электро- и радиотехнических средств измерений", en: "Repair of electrical and radio measuring instruments" },
      { uz: "Umumtexnik o'lchov vositalarini ta'mirlash (issiqlik-texnika va sarf, bosim, massa va kuch asboblari, gaz-alangali ishlov uskunalari)", ru: "Ремонт средств общетехнических измерений (теплотехники и расхода, давления, массы и силы, газопламенной обработки)", en: "Repair of general technical measuring instruments (thermal & flow, pressure, mass & force, gas-flame processing)" },
    ],
  },
  {
    Icon: Gauge,
    title: { uz: "Metrologiya", ru: "Метрология", en: "Metrology" },
    items: [
      { uz: "Nazorat-o'lchov uskunalari va o'lchov tizimlarini metrologik ta'minlash", ru: "Метрологическое обеспечение контрольно-измерительного оборудования и измерительных систем", en: "Metrological support of instrumentation and measuring systems" },
      { uz: "Ionlashtiruvchi nurlanish o'lchov vositalarini ta'mirlash va tekshirish (verifikatsiya)", ru: "Ремонт и поверка средств измерений ионизирующих излучений", en: "Repair and verification of ionizing radiation measuring instruments" },
    ],
  },
  {
    Icon: Wind,
    title: { uz: "Ventilyatsiya va iqlim", ru: "Вентиляция и климат", en: "Ventilation & HVAC" },
    items: [
      { uz: "Texnologik jarayon va xonalarda qo'llaniladigan ventilyatsiya va konditsionerlash tizimlarini sinash va sozlash", ru: "Испытание и наладка систем вентиляции и кондиционирования воздуха в технологических процессах и помещениях", en: "Testing and commissioning of ventilation and air-conditioning systems in processes and facilities" },
    ],
  },
  {
    Icon: ShieldCheck,
    title: { uz: "Xavfsizlik tizimlari", ru: "Системы безопасности", en: "Security systems" },
    items: [
      { uz: "Qo'riqlash-yong'in signalizatsiyasi (ОПС): montaj, sozlash, texnik xizmat va ta'mir", ru: "Охранно-пожарная сигнализация (ОПС): монтаж, наладка, обслуживание и ремонт", en: "Fire & security alarm (FSA): installation, commissioning, maintenance and repair" },
      { uz: "Videokuzatuv tizimlari: montaj, sozlash, texnik xizmat va ta'mir", ru: "Системы видеонаблюдения: монтаж, наладка, обслуживание и ремонт", en: "Video surveillance systems: installation, commissioning, maintenance and repair" },
      { uz: "Kirishni boshqarish tizimlari (СКУД): montaj, sozlash, texnik xizmat va ta'mir", ru: "Системы контроля и управления доступом (СКУД): монтаж, наладка, обслуживание и ремонт", en: "Access control systems (ACS): installation, commissioning, maintenance and repair" },
    ],
  },
  {
    Icon: KeyRound,
    title: { uz: "«Kalit topshirish» loyihalari", ru: "Проекты «под ключ»", en: "Turnkey projects" },
    items: [
      { uz: "Texnologik jarayon va ishlab chiqarishni avtomatlashtirish loyihalarini (ASUTP) «kalit topshirish» asosida ishlab chiqish va joriy etish — bosh pudratchi sifatida", ru: "Разработка и внедрение проектов автоматизации технологических процессов и производств (АСУТП) «под ключ» — генеральный подряд", en: "Development and implementation of turnkey process automation projects (ACS TP) — as general contractor" },
    ],
  },
];

export function ServiceGroups({ locale }: { locale: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {GROUPS.map((g, i) => {
        const Icon = g.Icon;
        return (
          <div
            key={i}
            className="flex flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                style={{
                  width: 46, height: 46,
                  background: "var(--accent-gradient)",
                  boxShadow: "0 6px 16px rgba(36,76,119,0.22)",
                }}>
                <Icon size={23} color="#fff" strokeWidth={1.7} />
              </div>
              <h3 className="font-display font-bold leading-snug" style={{ fontSize: 16.5, color: "#1E293B" }}>
                {tr(g.title, locale)}
              </h3>
            </div>

            {/* Checklist */}
            <ul className="flex flex-col gap-3">
              {g.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center rounded-md flex-shrink-0 mt-0.5"
                    style={{ width: 18, height: 18, background: "rgba(234,110,20,0.12)" }}>
                    <Check size={12} color="#DE7216" strokeWidth={3} />
                  </span>
                  <span className="leading-relaxed" style={{ fontSize: 13.5, color: "#475569" }}>
                    {tr(item, locale)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
