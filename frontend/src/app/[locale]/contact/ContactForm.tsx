"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api-client";
import type { LeadCreate } from "@/types/api";

const SUBJECTS = [
  "PLC/SCADA tizimi",
  "KIPiA va asbobsozlik",
  "Elektr ta'minoti",
  "Loyihalash va dizayn",
  "Texnik xizmat",
  "Boshqa",
];

export function ContactForm({ locale }: { locale: string }) {
  const t = useTranslations("contact.form");
  const [form, setForm] = useState<LeadCreate>({
    name: "",
    company: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
    source_page: "contact",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function set(field: keyof LeadCreate, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.phone && !form.email) {
      setErrorMsg(t("required_either"));
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      await api.leads.create(form);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="glass-card rounded-2xl border border-accent/30 p-10 text-center">
        <p className="text-5xl mb-4">✅</p>
        <p className="text-content font-semibold text-lg">{t("success")}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="glass-card rounded-2xl border border-border-subtle p-8 space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label={t("name")} required>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="form-input"
          />
        </Field>
        <Field label={t("company")}>
          <input
            type="text"
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
            className="form-input"
          />
        </Field>
        <Field label={t("phone")}>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className="form-input"
          />
        </Field>
        <Field label={t("email")}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="form-input"
          />
        </Field>
      </div>

      <Field label={t("subject")}>
        <select
          value={form.subject}
          onChange={(e) => set("subject", e.target.value)}
          className="form-input"
        >
          <option value="">—</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>

      <Field label={t("message")}>
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className="form-input resize-none"
        />
      </Field>

      {errorMsg && (
        <p className="text-red-400 text-sm">{errorMsg}</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-sm">{t("error")}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 rounded-xl bg-accent text-surface font-semibold text-lg shadow-glow hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-content-secondary text-sm font-medium block mb-1.5">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}
