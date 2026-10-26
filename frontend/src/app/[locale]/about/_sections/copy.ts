export type Loc = Record<string, string>;
export const tr = (o: Loc, l: string) => o[l] ?? o.uz;

export interface TrustStat { value: number; label: string; suffix?: string }

export const PALETTE = ["56,189,248", "16,185,129", "139,92,246", "245,158,11", "236,72,153", "6,182,212"];

export { EASE } from "@/components/editorial/hooks";

export const T = {
  badge:        { uz: "Korxona haqida", ru: "О предприятии", en: "About the enterprise" },
  scroll:       { uz: "Pastga suring", ru: "Листайте вниз", en: "Scroll" },
  mission:      { uz: "Biz haqimizda", ru: "О нас", en: "Who we are" },
  goals:        { uz: "Maqsad va vazifalar", ru: "Цели и задачи", en: "Goals & objectives" },
  history:      { uz: "Tarix", ru: "История", en: "History" },
  structure:    { uz: "Tashkiliy tuzilma", ru: "Организационная структура", en: "Organizational structure" },
  structureTitle: { uz: "Bir markaz — olti yo'nalish", ru: "Один центр — шесть направлений", en: "One center — six disciplines" },
  hub:          { uz: "Markaziy laboratoriya", ru: "Центральная лаборатория", en: "Central laboratory" },
  accreditation:    { uz: "Akkreditatsiya va sifat", ru: "Аккредитация и качество", en: "Accreditation & quality" },
  accreditationTitle: { uz: "Ishonch hujjatlar bilan tasdiqlangan", ru: "Доверие, подтверждённое документами", en: "Trust, backed by documents" },
  accreditationSub: { uz: "Faoliyatimiz davlat va xalqaro standartlar bilan tasdiqlangan.", ru: "Наша деятельность подтверждена государственными и международными стандартами.", en: "Our operations are certified to national and international standards." },
  allCerts:     { uz: "Barcha sertifikatlar", ru: "Все сертификаты", en: "All certificates" },
  intl:         { uz: "Xalqaro", ru: "Международный", en: "International" },
  national:     { uz: "Milliy", ru: "Национальный", en: "National" },
  seal:         { uz: "AKKREDITATSIYALANGAN • SERTIFIKATLANGAN • ", ru: "АККРЕДИТОВАНО • СЕРТИФИЦИРОВАНО • ", en: "ACCREDITED • CERTIFIED • STANDARDS COMPLIANT • " },
} satisfies Record<string, Loc>;

export function structureSub(n: number, locale: string) {
  if (locale === "ru") return `${n} специализированных лабораторий в составе центральной лаборатории — выберите любую, чтобы узнать больше.`;
  if (locale === "en") return `${n} specialized laboratories within the central laboratory — choose one to learn more.`;
  return `Markaziy laboratoriya tarkibidagi ${n} ta ixtisoslashgan laboratoriya — batafsil tanishish uchun birini tanlang.`;
}

// Real internal department codes from the organization's own org chart,
// kept constant across locales the way "PLC"/"SCADA" would be.
export const DEPT_CODE: Record<string, string> = {
  asutp: "АСУТП", taae: "ТАиАЭ", itso: "ИТСОиАПС", mop: "МОП", rsi: "РСИ", insa: "ИНСА",
};
