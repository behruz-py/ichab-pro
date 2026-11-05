"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Clock, Globe, Mail, MapPin, Phone, Printer, type LucideIcon } from "lucide-react";
import { EASE } from "@/components/editorial/hooks";

type Loc = Record<string, string>;
const T: Record<string, Loc> = {
  open:    { uz: "Hozir ochiq", ru: "Сейчас открыто", en: "Open now" },
  closed:  { uz: "Hozir yopiq", ru: "Сейчас закрыто", en: "Closed now" },
  copy:    { uz: "Nusxa olish", ru: "Копировать", en: "Copy" },
  copied:  { uz: "Nusxa olindi", ru: "Скопировано", en: "Copied" },
  map:     { uz: "Xaritada ochish", ru: "Открыть на карте", en: "Open in maps" },
  local:   { uz: "Navoiy vaqti", ru: "Время в Навои", en: "Navoi time" },
};
const MAP_URL = "https://maps.app.goo.gl/Y4XXTG9fBjgRpwsK6";

// Office hours from the footer copy: Monday–Friday, 8:00–17:00, Navoi (UTC+5).
function officeState() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Tashkent", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const h = Number(get("hour")), m = Number(get("minute"));
  const weekday = !["Sat", "Sun"].includes(get("weekday"));
  return { open: weekday && h >= 8 && h < 17, time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}` };
}

function CopyButton({ value, locale }: { value: string; locale: string }) {
  const [done, setDone] = useState(false);
  const t = (k: string) => T[k][locale] ?? T[k].uz;
  return (
    <button type="button" aria-label={done ? t("copied") : t("copy")} title={done ? t("copied") : t("copy")}
      onClick={async () => { try { await navigator.clipboard.writeText(value); setDone(true); setTimeout(() => setDone(false), 1600); } catch {} }}
      className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 opacity-60 hover:opacity-100"
      style={{ borderColor: done ? "transparent" : "var(--border)", background: done ? "rgb(16,185,129)" : "transparent", color: done ? "#fff" : "var(--content-secondary)" }}>
      {done ? <Check size={15} /> : <Copy size={14} />}
    </button>
  );
}

function Row({ i, Icon, label, children, action }: { i: number; Icon: LucideIcon; label: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <motion.li initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: EASE }}
      className="group grid grid-cols-[auto,1fr,auto] items-center gap-x-5 py-6" style={{ borderBottom: "1px solid var(--border)" }}>
      <span className="flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-300 group-hover:bg-[rgba(var(--accent-rgb),0.14)]"
        style={{ border: "1px solid var(--border)", color: "var(--accent)" }}>
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: "var(--content-muted)" }}>{label}</p>
        {children}
      </div>
      {action ?? <span />}
    </motion.li>
  );
}

export function ContactDirectory({ locale, phones, fax, email, website, address, hours, labels }: {
  locale: string; phones: string[]; fax: string; email: string; website: string; address: string; hours: string;
  labels: Record<"phone" | "fax" | "email" | "website" | "address" | "hours", string>;
}) {
  const t = (k: string) => T[k][locale] ?? T[k].uz;
  const [state, setState] = useState<{ open: boolean; time: string } | null>(null);
  useEffect(() => {
    setState(officeState());
    const id = setInterval(() => setState(officeState()), 30_000);
    return () => clearInterval(id);
  }, []);

  const big = "font-display font-semibold leading-tight transition-colors duration-300 hover:text-[var(--accent)]";
  const tel = (p: string) => `tel:${p.replace(/[\s-]/g, "")}`;
  let n = 0;

  return (
    <ul style={{ borderTop: "1px solid var(--border)" }}>
      {phones.map((p) => (
        <Row key={p} i={n++} Icon={Phone} label={labels.phone} action={<CopyButton value={p} locale={locale} />}>
          <a href={tel(p)} className={`${big} block tabular-nums`} style={{ fontSize: "clamp(22px,2.2vw,34px)", color: "var(--content)" }}>{p}</a>
        </Row>
      ))}
      <Row i={n++} Icon={Mail} label={labels.email} action={<CopyButton value={email} locale={locale} />}>
        <a href={`mailto:${email}`} className={`${big} block break-all`} style={{ fontSize: "clamp(20px,1.8vw,28px)", color: "var(--content)" }}>{email}</a>
      </Row>
      <Row i={n++} Icon={MapPin} label={labels.address}
        action={
          <a href={MAP_URL} target="_blank" rel="noopener noreferrer" aria-label={t("map")} title={t("map")}
            className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full border transition-transform duration-500 hover:rotate-45"
            style={{ borderColor: "var(--border)", color: "var(--content-secondary)" }}>
            <ArrowUpRight size={16} />
          </a>
        }>
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="block leading-relaxed transition-colors hover:text-[var(--accent)]" style={{ fontSize: 17, color: "var(--content)" }}>{address}</a>
      </Row>
      <Row i={n++} Icon={Clock} label={labels.hours}>
        <p style={{ fontSize: 17, color: "var(--content)" }}>{hours}</p>
        {state && (
          <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: state.open ? "rgb(16,185,129)" : "var(--content-muted)" }}>
            <span className={`w-2 h-2 rounded-full ${state.open ? "lab-active-dot" : ""}`} style={{ background: state.open ? "rgb(16,185,129)" : "var(--content-muted)" }} />
            {state.open ? t("open") : t("closed")}
            <span className="font-normal" style={{ color: "var(--content-muted)" }}>· {t("local")} {state.time}</span>
          </p>
        )}
      </Row>
      <Row i={n++} Icon={Printer} label={labels.fax}>
        <p className="tabular-nums" style={{ fontSize: 17, color: "var(--content)" }}>{fax}</p>
      </Row>
      <Row i={n++} Icon={Globe} label={labels.website}>
        <a href={`https://${website}`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--accent)]" style={{ fontSize: 17, color: "var(--content)" }}>{website}</a>
      </Row>
    </ul>
  );
}
