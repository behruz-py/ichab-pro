"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, ChevronDown, Loader2, Package } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import type { LeadCreate } from "@/types/api";
import { EASE } from "@/components/editorial/hooks";

type Loc = Record<string, string>;
const OTHER: Loc = { uz: "Boshqa", ru: "Другое", en: "Other" };
const PRODUCT: Loc = { uz: "Mahsulot bo'yicha so'rov", ru: "Запрос по изделию", en: "Product inquiry" };
const AGAIN: Loc = { uz: "Yana murojaat yuborish", ru: "Отправить ещё одно обращение", en: "Send another inquiry" };
const CHOOSE: Loc = { uz: "Tanlang (ixtiyoriy)", ru: "Выберите (необязательно)", en: "Choose (optional)" };

/** Native select styled like the underlined fields; keeps keyboard and mobile pickers. */
function TopicSelect({ label, value, options, placeholder, onChange }: {
  label: string; value: string; options: string[]; placeholder: string; onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <div className="relative">
      <label htmlFor={id} className="block pt-1 text-xs uppercase tracking-[0.16em]" style={{ color: "var(--content-muted)" }}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}
        className="peer block w-full appearance-none bg-transparent pt-2 pb-3 pr-8 text-[17px] outline-none cursor-pointer"
        style={{ color: value ? "var(--content)" : "var(--content-muted)" }}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={18} className="absolute right-0 bottom-4 pointer-events-none" style={{ color: "var(--content-muted)" }} />
      <span className="absolute inset-x-0 bottom-0 h-px" style={{ background: "var(--border)" }} />
      <span className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 peer-focus:scale-x-100" style={{ background: "var(--hero-accent-gradient)" }} />
    </div>
  );
}

/** Underlined input with a label that floats up once the field has focus or a value. */
function Field({ label, required, invalid, value, onChange, type = "text", textarea, autoComplete }: {
  label: string; required?: boolean; invalid?: boolean; value: string; onChange: (v: string) => void;
  type?: string; textarea?: boolean; autoComplete?: string;
}) {
  const id = useId();
  const common = {
    id, value, required, "aria-invalid": invalid || undefined, autoComplete, placeholder: " ",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    className: "peer block w-full bg-transparent pt-7 pb-3 text-[17px] outline-none resize-none",
    style: { color: "var(--content)" },
  };
  return (
    <div className="relative group">
      {textarea ? <textarea rows={4} {...common} /> : <input type={type} {...common} />}
      <label htmlFor={id}
        className="absolute left-0 top-7 origin-left pointer-events-none transition-all duration-300 text-[17px] peer-focus:top-1 peer-focus:text-xs peer-focus:tracking-[0.16em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:tracking-[0.16em] peer-[:not(:placeholder-shown)]:uppercase"
        style={{ color: invalid ? "rgb(239,68,68)" : "var(--content-muted)" }}>
        {label}{required && <span style={{ color: "var(--accent)" }}> *</span>}
      </label>
      <span className="absolute inset-x-0 bottom-0 h-px" style={{ background: invalid ? "rgb(239,68,68)" : "var(--border)" }} />
      <span className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 peer-focus:scale-x-100"
        style={{ background: "var(--hero-accent-gradient)" }} />
    </div>
  );
}

export function ContactForm({ locale, topics }: { locale: string; topics: string[] }) {
  const t = useTranslations("contact.form");
  const tr = (o: Loc) => o[locale] ?? o.uz;
  const empty: LeadCreate = { name: "", company: "", phone: "", email: "", subject: "", message: "", source_page: "contact" };
  const [form, setForm] = useState<LeadCreate>(empty);
  const [product, setProduct] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [contactInvalid, setContactInvalid] = useState(false);
  const [nameInvalid, setNameInvalid] = useState(false);

  // Product pages link here with ?product=<name>: pre-select it as the topic.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("product")?.trim();
    if (p) {
      setProduct(p);
      setForm((f) => ({ ...f, subject: `${tr(PRODUCT)}: ${p}`, source_page: "product" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set(field: keyof LeadCreate, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if ((field === "phone" || field === "email") && contactInvalid) {
      setContactInvalid(false);
      setErrorMsg("");
    }
    if (field === "name" && nameInvalid) setNameInvalid(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const missingName = !form.name.trim();
    const missingContact = !form.phone && !form.email;
    setNameInvalid(missingName);
    setContactInvalid(missingContact);
    if (missingName || missingContact) {
      setErrorMsg(missingContact ? t("required_either") : "");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      await api.leads.create(form);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      if (err instanceof ApiError) {
        if (err.status === 429) setErrorMsg(t("rate_limited"));
        else {
          const detail = err.data && typeof err.data === "object" && "detail" in err.data ? String((err.data as { detail: unknown }).detail) : "";
          if (detail) setErrorMsg(detail);
        }
      }
    }
  }

  const chips = [...(product ? [`${tr(PRODUCT)}: ${product}`] : []), ...topics, tr(OTHER)];

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "success" ? (
        <motion.div key="ok" role="status" aria-live="polite"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: EASE }}
          className="py-16">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            className="flex items-center justify-center w-20 h-20 rounded-full mb-8" style={{ background: "var(--hero-accent-gradient)", boxShadow: "0 20px 50px rgba(var(--warm-glow),0.4)" }}>
            <Check size={38} color="#fff" strokeWidth={2.5} />
          </motion.span>
          <p className="font-display font-bold leading-tight" style={{ fontSize: "clamp(28px,3vw,44px)", color: "var(--content)" }}>{t("success")}</p>
          <button type="button" onClick={() => { setForm(empty); setProduct(null); setStatus("idle"); }}
            className="mt-8 text-sm font-semibold transition-opacity hover:opacity-80" style={{ color: "var(--accent)" }}>
            {tr(AGAIN)}
          </button>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={submit} noValidate
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
          {product && (
            <div className="mb-8 flex items-center gap-3 rounded-2xl px-5 py-4" style={{ background: "rgba(var(--accent-rgb),0.08)", border: "1px solid rgba(var(--accent-rgb),0.25)" }}>
              <Package size={18} style={{ color: "var(--accent)" }} className="shrink-0" />
              <p className="text-sm" style={{ color: "var(--content)" }}><span style={{ color: "var(--content-secondary)" }}>{tr(PRODUCT)}:</span> <strong>{product}</strong></p>
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
            <Field label={t("name")} required invalid={nameInvalid} value={form.name} onChange={(v) => set("name", v)} autoComplete="name" />
            <Field label={t("company")} value={form.company ?? ""} onChange={(v) => set("company", v)} autoComplete="organization" />
            <Field label={t("phone")} type="tel" invalid={contactInvalid} value={form.phone ?? ""} onChange={(v) => set("phone", v)} autoComplete="tel" />
            <Field label={t("email")} type="email" invalid={contactInvalid} value={form.email ?? ""} onChange={(v) => set("email", v)} autoComplete="email" />
            <div className="sm:col-span-2">
              <TopicSelect label={t("subject")} value={form.subject ?? ""} options={chips} placeholder={tr(CHOOSE)} onChange={(v) => set("subject", v)} />
            </div>
            <div className="sm:col-span-2">
              <Field label={t("message")} textarea value={form.message ?? ""} onChange={(v) => set("message", v)} />
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <button type="submit" disabled={status === "loading"}
              className="group relative isolate inline-flex items-center gap-3 pl-8 pr-2 py-2 rounded-full overflow-hidden font-semibold text-base text-white disabled:opacity-70 transition-shadow duration-500 hover:shadow-[0_18px_50px_rgba(var(--warm-glow),0.5)]"
              style={{ background: "var(--warm-btn)", boxShadow: "0 14px 40px rgba(var(--warm-glow),0.35)" }}>
              <span aria-hidden className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full -z-10 scale-0 bg-white/15 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[9] motion-reduce:transition-none" />
              <span>{status === "loading" ? t("submitting") : t("submit")}</span>
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
                {status === "loading" ? <Loader2 size={18} className="animate-spin" /> : <ArrowUpRight size={18} className="transition-transform duration-500 group-hover:rotate-45" />}
              </span>
            </button>
            {(errorMsg || status === "error") && (
              <p className="text-sm font-medium" role="alert" aria-live="assertive" style={{ color: "rgb(239,68,68)" }}>{errorMsg || t("error")}</p>
            )}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
