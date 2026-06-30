import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Loc = Record<string, string>;
const TITLE: Loc = { uz: "Loyihangiz uchun yechim kerakmi?", ru: "Нужно решение для вашего проекта?", en: "Need a solution for your project?" };
const SUB: Loc = {
  uz: "Sanoat avtomatizatsiyasi, PLC/SCADA va o'lchov tizimlari bo'yicha mutaxassislarimiz bilan bog'laning.",
  ru: "Свяжитесь с нашими специалистами по промышленной автоматизации, PLC/SCADA и измерительным системам.",
  en: "Get in touch with our experts in industrial automation, PLC/SCADA and measurement systems.",
};
const BTN: Loc = { uz: "Biz bilan bog'lanish", ru: "Связаться с нами", en: "Contact us" };

export function StatsCta({ locale }: { locale: string }) {
  const t = (o: Loc) => o[locale] ?? o.uz;
  return (
    <div className="cta-flow-border mt-24">
      <div className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden" style={{ background: "var(--card-solid)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <h2 className="font-display font-bold text-content" style={{ fontSize: "clamp(24px,3.2vw,40px)" }}>{t(TITLE)}</h2>
        <p className="mt-4 max-w-xl mx-auto" style={{ color: "var(--content-secondary)" }}>{t(SUB)}</p>
        <Link href={`/${locale}/contact`} className="group cta-pulse inline-flex items-center gap-2 mt-8 px-9 py-4 rounded-2xl font-semibold text-base text-white transition-transform duration-200 hover:scale-[1.04] hover:-translate-y-0.5"
          style={{ background: "var(--warm-btn)" }}>
          {t(BTN)}
          <span className="inline-flex transition-transform duration-200 group-hover:translate-x-1"><ArrowRight size={18} /></span>
        </Link>
      </div>
    </div>
  );
}
