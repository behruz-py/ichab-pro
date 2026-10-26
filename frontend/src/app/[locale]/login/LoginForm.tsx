"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, KeyRound, Loader2, AlertCircle } from "lucide-react";

type Loc = Record<string, string>;
const L: Record<string, Loc> = {
  title:      { uz: "Xodimlar uchun kirish", ru: "Вход для сотрудников", en: "Staff sign-in" },
  sub:        { uz: "Ichki bo'limga kirish uchun login va parolingizni kiriting", ru: "Введите логин и пароль для входа во внутренний раздел", en: "Enter your username and password to access the internal section" },
  username:   { uz: "Login", ru: "Логин", en: "Username" },
  password:   { uz: "Parol", ru: "Пароль", en: "Password" },
  submit:     { uz: "Kirish", ru: "Войти", en: "Sign in" },
  credentials:{ uz: "Login yoki parol noto'g'ri", ru: "Неверный логин или пароль", en: "Incorrect username or password" },
  throttled:  { uz: "Juda ko'p urinish. Bir daqiqadan so'ng qayta urinib ko'ring", ru: "Слишком много попыток. Повторите через минуту", en: "Too many attempts. Try again in a minute" },
  failed:     { uz: "Server bilan bog'lanib bo'lmadi. Keyinroq urinib ko'ring", ru: "Не удалось связаться с сервером. Попробуйте позже", en: "Couldn't reach the server. Please try again later" },
  expired:    { uz: "Sessiya muddati tugadi, qayta kiring", ru: "Сессия истекла, войдите снова", en: "Your session has expired, please sign in again" },
  hint:       { uz: "Hisob ochish uchun administratorga murojaat qiling", ru: "Для получения доступа обратитесь к администратору", en: "Contact the administrator to get an account" },
};

export function LoginForm({ locale, next, expired }: { locale: string; next: string; expired: boolean }) {
  const t = (k: string) => L[k][locale] ?? L[k].uz;
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(expired ? t("expired") : null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.replace(next);
        router.refresh();
        return;
      }
      const { error: code } = await res.json().catch(() => ({ error: "failed" }));
      setError(t(code === "credentials" || code === "invalid" ? "credentials" : code === "throttled" ? "throttled" : "failed"));
    } catch {
      setError(t("failed"));
    }
    setBusy(false);
  }

  const field = "w-full pl-11 pr-4 py-3 rounded-xl text-[15px] outline-none transition-shadow duration-200 focus:ring-2";

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(var(--accent-rgb),0.14) 0%, transparent 65%)" }} />

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-3xl p-8 sm:p-10"
        style={{ background: "var(--card-bg)", border: "1px solid var(--glass-border)", boxShadow: "var(--card-shadow)" }}
      >
        <div className="flex justify-center mb-5">
          <span className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--warm-btn)", boxShadow: "0 10px 26px rgba(var(--warm-glow),0.35)" }}>
            <Lock size={24} color="#fff" />
          </span>
        </div>
        <h1 className="font-display font-bold text-content text-center text-2xl">{t("title")}</h1>
        <p className="text-center text-sm mt-2 mb-7" style={{ color: "var(--content-secondary)" }}>{t("sub")}</p>

        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-xl px-3.5 py-3 mb-5 text-sm"
            style={{ background: "rgba(248,113,113,0.10)", border: "1px solid rgba(248,113,113,0.35)", color: "rgb(220,38,38)" }}>
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" /> {error}
          </div>
        )}

        <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--content-secondary)" }} htmlFor="username">{t("username")}</label>
        <div className="relative mb-4">
          <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--content-muted)" }} />
          <input id="username" name="username" autoComplete="username" required autoFocus
            value={username} onChange={(e) => setUsername(e.target.value)}
            className={field} style={{ background: "var(--surface-secondary, rgba(var(--accent-rgb),0.04))", border: "1px solid var(--border)", color: "var(--content)" }} />
        </div>

        <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--content-secondary)" }} htmlFor="password">{t("password")}</label>
        <div className="relative mb-7">
          <KeyRound size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--content-muted)" }} />
          <input id="password" name="password" type="password" autoComplete="current-password" required
            value={password} onChange={(e) => setPassword(e.target.value)}
            className={field} style={{ background: "var(--surface-secondary, rgba(var(--accent-rgb),0.04))", border: "1px solid var(--border)", color: "var(--content)" }} />
        </div>

        <button type="submit" disabled={busy}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
          style={{ background: "var(--warm-btn)", boxShadow: "0 8px 24px rgba(var(--warm-glow),0.34)" }}>
          {busy && <Loader2 size={17} className="animate-spin" />} {t("submit")}
        </button>

        <p className="text-center text-xs mt-6" style={{ color: "var(--content-muted)" }}>{t("hint")}</p>
      </motion.form>
    </div>
  );
}
