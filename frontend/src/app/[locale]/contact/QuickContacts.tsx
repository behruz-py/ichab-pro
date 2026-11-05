"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { EASE } from "@/components/editorial/hooks";

type Loc = Record<string, string>;
const T: Record<string, Loc> = {
  call:   { uz: "Qo'ng'iroq qiling", ru: "Позвоните", en: "Call us" },
  write:  { uz: "Yozing", ru: "Напишите", en: "Write to us" },
  visit:  { uz: "Tashrif buyuring", ru: "Приезжайте", en: "Visit us" },
  open:   { uz: "Hozir ochiq", ru: "Сейчас открыто", en: "Open now" },
  closed: { uz: "Hozir yopiq", ru: "Сейчас закрыто", en: "Closed now" },
  copy:   { uz: "Nusxa olish", ru: "Копировать", en: "Copy" },
  copied: { uz: "Nusxa olindi", ru: "Скопировано", en: "Copied" },
  map:    { uz: "Xaritada ochish", ru: "Открыть на карте", en: "Open in maps" },
  reply:  { uz: "Savol va takliflaringizni yozib yuboring", ru: "Присылайте ваши вопросы и предложения", en: "Send us your questions and proposals" },
};
const MAP_URL = "https://maps.app.goo.gl/Y4XXTG9fBjgRpwsK6";

// Office hours from the footer copy: Monday–Friday, 8:00–17:00, Navoi (UTC+5).
function isOpenNow() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Tashkent", weekday: "short", hour: "2-digit", hour12: false }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const h = Number(get("hour"));
  return !["Sat", "Sun"].includes(get("weekday")) && h >= 8 && h < 17;
}

function CopyButton({ value, locale }: { value: string; locale: string }) {
  const [done, setDone] = useState(false);
  const t = (k: string) => T[k][locale] ?? T[k].uz;
  return (
    <button type="button" aria-label={done ? t("copied") : t("copy")} title={done ? t("copied") : t("copy")}
      onClick={async () => { try { await navigator.clipboard.writeText(value); setDone(true); setTimeout(() => setDone(false), 1600); } catch {} }}
      className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300"
      style={{ borderColor: done ? "transparent" : "var(--border)", background: done ? "rgb(16,185,129)" : "transparent", color: done ? "#fff" : "var(--content-muted)" }}>
      {done ? <Check size={14} /> : <Copy size={13} />}
    </button>
  );
}

function Column({ i, Icon, title, children }: { i: number; Icon: LucideIcon; title: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: EASE }}
      className="py-8 lg:py-0 lg:px-10 lg:first:pl-0 lg:last:pr-0 lg:border-l lg:first:border-l-0 border-t lg:border-t-0 first:border-t-0"
      style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center gap-3 mb-5">
        <span className="flex items-center justify-center w-10 h-10 rounded-full" style={{ background: "rgba(var(--accent-rgb),0.12)", color: "var(--accent)" }}>
          <Icon size={18} />
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--content-muted)" }}>{title}</span>
      </div>
      {children}
    </motion.div>
  );
}

/** The three direct ways to reach the department, side by side. */
export function QuickContacts({ locale, phones, email, address, hours }: {
  locale: string; phones: string[]; email: string; address: string; hours: string;
}) {
  const t = (k: string) => T[k][locale] ?? T[k].uz;
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    setOpen(isOpenNow());
    const id = setInterval(() => setOpen(isOpenNow()), 60_000);
    return () => clearInterval(id);
  }, []);
  const link = "font-display font-semibold leading-tight tabular-nums transition-colors duration-300 hover:text-[var(--accent)]";

  return (
    <div className="grid lg:grid-cols-3 py-2 lg:py-10" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <Column i={0} Icon={Phone} title={t("call")}>
        <div className="space-y-3">
          {phones.map((p) => (
            <div key={p} className="flex items-center justify-between gap-3">
              <a href={`tel:${p.replace(/[\s-]/g, "")}`} className={link} style={{ fontSize: "clamp(22px,2vw,30px)", color: "var(--content)" }}>{p}</a>
              <CopyButton value={p} locale={locale} />
            </div>
          ))}
        </div>
        {open !== null && (
          <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: open ? "rgb(16,185,129)" : "var(--content-muted)" }}>
            <span className={`w-2 h-2 rounded-full ${open ? "lab-active-dot" : ""}`} style={{ background: open ? "rgb(16,185,129)" : "var(--content-muted)" }} />
            {open ? t("open") : t("closed")} · <span className="font-normal">{hours}</span>
          </p>
        )}
      </Column>

      <Column i={1} Icon={Mail} title={t("write")}>
        <div className="flex items-center justify-between gap-3">
          <a href={`mailto:${email}`} className={`${link} break-all`} style={{ fontSize: "clamp(22px,2vw,30px)", color: "var(--content)" }}>{email}</a>
          <CopyButton value={email} locale={locale} />
        </div>
        <p className="mt-4 text-sm" style={{ color: "var(--content-secondary)" }}>{t("reply")}</p>
      </Column>

      <Column i={2} Icon={MapPin} title={t("visit")}>
        <p className="leading-relaxed" style={{ fontSize: 17, color: "var(--content)" }}>{address}</p>
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer"
          className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--accent)" }}>
          {t("map")} <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:rotate-45" />
        </a>
      </Column>
    </div>
  );
}
