/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import {
  ArrowRight, ShieldCheck, Cpu, Gauge, Settings, Factory,
  Send, FileDown, Star, ChevronDown, MapPin, Phone, Mail,
} from "lucide-react";

// Hidden style-exploration page — not indexed, isolated full-screen overlay so
// it does not inherit the live dark header/footer.
export const metadata: Metadata = {
  title: "Uslub namunasi — Yumshoq och (slate)",
  robots: { index: false, follow: false },
};

// ─── Muted slate palette tokens (v2: deeper canvas, calmer accents) ─────────
const C = {
  page:    "#E5EAF1",   // deeper tinted gray-blue (less white)
  pageEnd: "#DCE3EC",   // subtle gradient end
  surface: "#F7F9FC",   // off-white card (not pure white)
  subtle:  "#EDF1F6",   // section band
  border:  "rgba(15,23,42,0.10)",
  text:    "#1E293B",
  text2:   "#475569",
  muted:   "#94A3B8",
  sky:     "#3E6A99",   // muted steel blue (primary accent)
  skyDeep: "#2D5279",   // deeper steel blue
  teal:    "#5A8B8E",   // muted teal-slate (sparingly)
  // 3-stop blue gradient — lighter top-left adds a subtle premium sheen
  grad:    "linear-gradient(135deg, #517FB0 0%, #3E6A99 48%, #2A4E75 100%)",
  // Subtle card surface gradient — barely lighter at top-left = soft depth
  cardBg:  "linear-gradient(165deg, #FCFDFE 0%, #F2F6FB 100%)",
  // Warm complementary accent — used sparingly for highlights / featured
  warm:    "linear-gradient(135deg, #F2972F 0%, #F9C04D 100%)",
  warmSolid: "#E8852C",
  warmTint:  "rgba(239,142,54,0.12)",
  // Card shadow with a faint steel-blue tint = premium floating depth
  cardShadow: "0 1px 2px rgba(15,23,42,0.04), 0 12px 30px rgba(45,82,121,0.08)",
};

export default function StylePreviewPage() {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200, overflowY: "auto",
        background: `linear-gradient(180deg, ${C.page} 0%, ${C.pageEnd} 100%)`,
        color: C.text,
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      {/* Preview banner */}
      <div style={{ background: C.grad, color: "#fff", textAlign: "center", fontSize: 12, fontWeight: 600, padding: "6px 12px", letterSpacing: "0.02em" }}>
        NAMUNA — “Yumshoq och (slate)” uslubi · bu yashirin sahifa, asosiy saytga ta'sir qilmaydi
      </div>

      {/* ── Navbar ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(243,246,250,0.82)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(62,106,153,0.30)" }}>
              <Settings size={20} color="#fff" />
            </div>
            <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "0.06em", color: C.text }}>ICHAB</span>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13.5, fontWeight: 500, color: C.text2 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: 10, color: C.sky, background: "rgba(62,106,153,0.08)" }}>Kompaniya <ChevronDown size={13} /></span>
            <span style={{ padding: "8px 14px" }}>Xizmatlar</span>
            <span style={{ padding: "8px 14px" }}>Mahsulotlar</span>
            <span style={{ padding: "8px 14px" }}>Loyihalar</span>
            <span style={{ padding: "8px 14px" }}>Aloqa</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: C.text2, border: `1px solid ${C.border}`, padding: "6px 12px", borderRadius: 9 }}>UZ</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", background: C.grad, padding: "8px 18px", borderRadius: 10, boxShadow: "0 4px 14px rgba(62,106,153,0.30)" }}>Bog&apos;lanish</span>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ position: "relative", maxWidth: 1240, margin: "0 auto", padding: "72px 24px 48px" }}>
        {/* Soft radial glow — premium depth, very low opacity */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden",
          background:
            "radial-gradient(620px 380px at 18% 28%, rgba(62,106,153,0.10), transparent 70%)," +
            "radial-gradient(520px 360px at 88% 72%, rgba(239,142,54,0.07), transparent 70%)",
        }} />
        <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48, alignItems: "center" }}>
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: C.sky, background: "rgba(62,106,153,0.10)", padding: "6px 14px", borderRadius: 999 }}>
              <ShieldCheck size={14} /> Sanoat avtomatizatsiyasi
            </span>
            <h1 style={{ fontSize: "clamp(34px, 4.5vw, 56px)", fontWeight: 800, lineHeight: 1.08, margin: "20px 0 18px", color: C.text, letterSpacing: "-0.02em" }}>
              Ishlab chiqarishni <span style={{ background: C.warm, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>aqlli tizimlar</span> bilan modernizatsiya
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: C.text2, maxWidth: 520, marginBottom: 28 }}>
              PLC, SCADA, sensorlar va boshqaruv tizimlari bo'yicha to'liq yechimlar. O'zbekiston sanoatini xalqaro standartlarga mos darajaga olib chiqamiz.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, color: "#fff", background: C.grad, padding: "13px 26px", borderRadius: 14, boxShadow: "0 8px 24px rgba(62,106,153,0.28)" }}>
                Loyiha boshlash <ArrowRight size={17} />
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, color: C.text, background: C.surface, padding: "13px 26px", borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: C.cardShadow }}>
                Loyihalarni ko'rish <ArrowRight size={17} />
              </span>
            </div>

            {/* Warm star-rating highlight */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 24, background: C.warmTint, padding: "8px 16px", borderRadius: 999 }}>
              <span style={{ display: "inline-flex", gap: 2 }}>
                {[0,1,2,3,4].map(i => <Star key={i} size={15} fill={C.warmSolid} color={C.warmSolid} />)}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>5.0 — 100+ mijoz ishonchi</span>
            </div>
          </div>

          {/* Hero visual card */}
          <div style={{ background: C.cardBg, borderRadius: 24, border: `1px solid ${C.border}`, boxShadow: C.cardShadow, padding: 28 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { Icon: Cpu, label: "PLC tizimlari", val: "120+", warm: false },
                { Icon: Gauge, label: "SCADA loyihalar", val: "85+", warm: false },
                { Icon: Factory, label: "Avtomatika", val: "150+", warm: false },
                { Icon: ShieldCheck, label: "Sertifikatlar", val: "ISO", warm: true },
              ].map(({ Icon, label, val, warm }, i) => (
                <div key={i} style={{ background: C.subtle, borderRadius: 16, border: `1px solid ${C.border}`, padding: "18px 16px" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: warm ? C.warm : "rgba(62,106,153,0.10)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, boxShadow: warm ? "0 4px 12px rgba(239,142,54,0.30)" : "none" }}>
                    <Icon size={20} color={warm ? "#fff" : C.sky} />
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.text }}>{val}</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: "rgba(243,246,250,0.55)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "16px 24px", display: "flex", flexWrap: "wrap", gap: 28, justifyContent: "center" }}>
          {["ISO 9001:2015", "25+ yil tajriba", "150+ loyiha", "PLC · SCADA · HMI", "24/7 yordam", "Xalqaro standartlar"].map((t, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500, color: C.text2 }}>
              <ShieldCheck size={14} color={C.teal} /> {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Cards (mahsulotlar/bo'linmalar) ── */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 24px" }}>
        <div style={{ marginBottom: 28 }}>
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: C.sky }}>Bo'linmalar</span>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: C.text, marginTop: 6 }}>Bizning yo'nalishlar</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { Icon: Cpu, title: "INSA — Aqlli tizimlar", desc: "Sanoat kompyuterlari va aqlli boshqaruv yechimlari.", featured: true },
            { Icon: Gauge, title: "ASUTP — Avtomatlashtirish", desc: "Texnologik jarayonlarni avtomatik boshqarish tizimlari.", featured: false },
            { Icon: Settings, title: "MOP — Modernizatsiya", desc: "Eski uskunalarni zamonaviy darajaga yangilash.", featured: false },
          ].map(({ Icon, title, desc, featured }, i) => (
            <div key={i} style={{ position: "relative", background: C.cardBg, borderRadius: 18, border: `1px solid ${C.border}`, boxShadow: C.cardShadow, padding: 24, transition: "transform .2s, box-shadow .2s" }}
              className="preview-card">
              {featured && (
                <span style={{ position: "absolute", top: 16, right: 16, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#fff", background: C.warm, padding: "4px 11px", borderRadius: 999, boxShadow: "0 3px 10px rgba(239,142,54,0.35)" }}>
                  <Star size={11} fill="#fff" color="#fff" /> Yetakchi
                </span>
              )}
              <div style={{ width: 48, height: 48, borderRadius: 14, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: "0 6px 18px rgba(62,106,153,0.25)" }}>
                <Icon size={24} color="#fff" />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: C.text2, marginBottom: 16 }}>{desc}</p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: C.sky }}>Batafsil <ArrowRight size={14} /></span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Product detail mock: gallery + info + spec table ── */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "8px 24px 56px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, marginBottom: 32 }}>
          <div style={{ background: C.cardBg, borderRadius: 20, border: `1px solid ${C.border}`, boxShadow: C.cardShadow, aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Factory size={64} strokeWidth={1.2} color={C.muted} />
          </div>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.sky }}>Avtomatika shkaflari</span>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, margin: "10px 0 12px" }}>Kirish-taqsimlash qurilmasi (ВРУ)</h2>
            <div style={{ display: "flex", gap: 18, fontSize: 13.5, color: C.text2, marginBottom: 16 }}>
              <span>Artikul: <b style={{ color: C.text }}>ВРУ-1-21</b></span>
              <span style={{ background: "rgba(90,139,142,0.12)", color: "#4a7c7f", padding: "3px 12px", borderRadius: 999, fontWeight: 600, fontSize: 12 }}>Mavjud</span>
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.65, color: C.text2, marginBottom: 22 }}>
              Elektr energiyasini qabul qilish, taqsimlash va hisobga olish uchun mo'ljallangan. Ortiqcha yuklanish va qisqa tutashuvdan himoya.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "#fff", background: C.grad, padding: "12px 22px", borderRadius: 12, boxShadow: "0 6px 18px rgba(62,106,153,0.26)" }}>
                <Send size={16} /> So'rov yuborish
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: C.sky, padding: "12px 22px", borderRadius: 12, border: `1px solid rgba(62,106,153,0.35)` }}>
                <FileDown size={16} /> Katalog (PDF)
              </span>
            </div>
          </div>
        </div>

        {/* Spec comparison table */}
        <div style={{ borderRadius: 18, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: C.cardShadow, background: C.surface }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.border}`, background: C.subtle }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Modellar bo'yicha taqqoslash</h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse", fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: "rgba(62,106,153,0.05)" }}>
                  <th style={{ textAlign: "left", padding: "12px 18px", color: C.text2, fontWeight: 700, fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Parametr</th>
                  {["ВТЕ-200/48", "ВТЕ-315/75", "ВТЕ-315/150"].map((c, i) => (
                    <th key={i} style={{ textAlign: "center", padding: "12px 16px", color: C.sky, fontWeight: 700, fontSize: 11.5, textTransform: "uppercase" }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Nominal quvvat, kVA", "15,12", "23,62", "47,25"],
                  ["Nominal tok, A", "200", "—", "—"],
                  ["Kuchlanish, V", "48", "75", "150"],
                  ["KPD, %", "91", "92", "94"],
                ].map((row, ri) => (
                  <tr key={ri} style={{ background: ri % 2 ? "transparent" : "rgba(15,23,42,0.015)" }}>
                    <td style={{ padding: "11px 18px", color: C.text2, fontWeight: 500, borderTop: `1px solid ${C.border}` }}>{row[0]}</td>
                    {row.slice(1).map((v, ci) => (
                      <td key={ci} style={{ padding: "11px 16px", textAlign: "center", color: C.text, fontWeight: 600, borderTop: `1px solid ${C.border}` }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA band ── */}
      <section style={{ maxWidth: 1240, margin: "0 auto 56px", padding: "0 24px" }}>
        <div style={{ background: `radial-gradient(120% 140% at 50% -20%, rgba(255,255,255,0.18), transparent 55%), ${C.grad}`, borderRadius: 24, padding: "48px 40px", textAlign: "center", boxShadow: "0 16px 48px rgba(45,82,121,0.30)" }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Loyihangizni boshlaymizmi?</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.9)", marginBottom: 24, maxWidth: 520, marginInline: "auto" }}>
            Bepul konsultatsiya oling — mutaxassislarimiz texnik talablarni aniqlaydi.
          </p>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 700, color: "#fff", background: C.warm, padding: "13px 28px", borderRadius: 14, boxShadow: "0 8px 24px rgba(239,142,54,0.40)" }}>
            Bog&apos;lanish <ArrowRight size={17} />
          </span>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#1E293B", color: "#CBD5E1" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "44px 24px 28px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Settings size={19} color="#fff" />
              </div>
              <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "0.06em" }}>ICHAB</span>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#94A3B8", maxWidth: 320 }}>
              Ishlab chiqarishni avtomatlashtirish boshqarmasi. Sanoat uchun aqlli tizimlar.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.teal, marginBottom: 14 }}>Bo'limlar</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 9, fontSize: 13.5, color: "#94A3B8" }}>
              <li>Biz haqimizda</li><li>Xizmatlar</li><li>Mahsulotlar</li><li>Loyihalar</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.teal, marginBottom: 14 }}>Aloqa</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 11, fontSize: 13.5, color: "#94A3B8" }}>
              <li style={{ display: "flex", gap: 10 }}><MapPin size={16} color={C.teal} /> Toshkent sh., O'zbekiston</li>
              <li style={{ display: "flex", gap: 10 }}><Phone size={16} color={C.teal} /> +998 71 000 00 00</li>
              <li style={{ display: "flex", gap: 10 }}><Mail size={16} color={C.teal} /> info@ichab.uz</li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", padding: "16px 24px", fontSize: 12.5, color: "#64748B", display: "flex", justifyContent: "space-between" }}>
            <span>© 2026 ICHAB</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>Sifat bilan ishlangan <Star size={12} fill={C.warmSolid} color={C.warmSolid} /></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
