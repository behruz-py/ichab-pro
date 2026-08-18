"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight, Phone, Mail, Award, CheckCircle2, User, Cog } from "lucide-react";
import { DynamicIcon, resolveIcon } from "@/components/ui/DynamicIcon";
import { mediaUrl, formatDate } from "@/lib/utils";
import type {
  DivisionStat, DivisionCapability, DivisionEquipment,
  DivisionGalleryImage, DivisionStandard, DivisionTeamMember, Project,
} from "@/types/api";

type Loc = Record<string, string>;

export interface LabData {
  name: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string | null;
  logo: string | null;
  leaderName: string;
  leaderPosition: string;
  contactPhone: string;
  contactEmail: string;
  stats: DivisionStat[];
  capabilities: DivisionCapability[];
  equipment: DivisionEquipment[];
  gallery: DivisionGalleryImage[];
  standards: DivisionStandard[];
  teamMembers: DivisionTeamMember[];
  relatedProjects: Project[];
}

// A rotating accent palette — every content item cycles through these so the
// page reads as vivid and hand-designed without the admin having to pick colors.
const PALETTE = ["56,189,248", "16,185,129", "139,92,246", "245,158,11", "236,72,153", "6,182,212"];
const rgbAt = (i: number) => PALETTE[i % PALETTE.length];

const T = {
  overview:     { uz: "Umumiy", ru: "Обзор", en: "Overview" },
  capabilities: { uz: "Imkoniyatlar", ru: "Возможности", en: "Capabilities" },
  equipment:    { uz: "Jihozlar", ru: "Оборудование", en: "Equipment" },
  gallery:      { uz: "Galereya", ru: "Галерея", en: "Gallery" },
  projects:     { uz: "Loyihalar", ru: "Проекты", en: "Projects" },
  standards:    { uz: "Standartlar", ru: "Стандарты", en: "Standards" },
  team:         { uz: "Jamoa", ru: "Команда", en: "Team" },
  contact:      { uz: "Aloqa", ru: "Контакты", en: "Contacts" },
  capabilitiesTitle: { uz: "Imkoniyatlar va xizmatlar", ru: "Возможности и услуги", en: "Capabilities & services" },
  equipmentTitle:    { uz: "Asosiy jihozlar", ru: "Ключевое оборудование", en: "Key equipment" },
  projectsTitle:     { uz: "Bog'liq loyihalar", ru: "Связанные проекты", en: "Related projects" },
  standardsTitle:    { uz: "Standartlar va akkreditatsiya", ru: "Стандарты и аккредитация", en: "Standards & accreditation" },
  teamTitle:         { uz: "Jamoa", ru: "Команда", en: "Team" },
  leader:       { uz: "Laboratoriya rahbari", ru: "Руководитель лаборатории", en: "Laboratory head" },
  cta:          { uz: "Xizmat so'rash", ru: "Запросить услугу", en: "Request a service" },
  ctaText:      { uz: "Loyihangiz uchun ushbu laboratoriya xizmatlaridan foydalanmoqchimisiz?", ru: "Хотите воспользоваться услугами этой лаборатории?", en: "Want to use this laboratory's services?" },
} satisfies Record<string, Loc>;
const tr = (o: Loc, l: string) => o[l] ?? o.uz;

function useCountUp(target: number, run: boolean, dur = 1500) {
  const [v, setV] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!run || started.current) return;
    started.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(target); return; }
    const t0 = performance.now(); let raf = 0;
    const tick = (t: number) => { const p = Math.min((t - t0) / dur, 1); setV(Math.round((1 - Math.pow(1 - p, 3)) * target)); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [run, target, dur]);
  return v;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display font-bold text-content mb-6" style={{ fontSize: "clamp(22px,2.8vw,34px)" }}>{children}</h2>;
}

function StatCard({ s, rgb, inView, i }: { s: DivisionStat; rgb: string; inView: boolean; i: number }) {
  const v = useCountUp(s.value, inView);
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 + i * 0.09 }}
      className="glass-card rounded-2xl p-4 sm:p-5" style={{ border: `1px solid rgba(${rgb},0.25)`, boxShadow: `var(--card-shadow), 0 0 24px rgba(${rgb},0.10)` }}>
      <DynamicIcon name={s.icon} size={20} className="inline-block" />
      <div className="font-display font-extrabold tabular-nums mt-2 leading-none" style={{ fontSize: "clamp(22px,2.6vw,32px)", color: "var(--content)" }}>{v}{s.suffix}</div>
    </motion.div>
  );
}

export function LabShowcase({ lab, locale, backLabel }: { lab: LabData; locale: string; backLabel: string }) {
  const hasCapabilities = lab.capabilities.length > 0;
  const hasEquipment = lab.equipment.length > 0;
  const hasGallery = lab.gallery.length > 0;
  const hasProjects = lab.relatedProjects.length > 0;
  const hasStandards = lab.standards.length > 0;
  const hasTeam = Boolean(lab.leaderName) || lab.teamMembers.length > 0;

  const nav = useMemo(() => [
    { id: "overview", label: T.overview, show: true },
    { id: "capabilities", label: T.capabilities, show: hasCapabilities },
    { id: "equipment", label: T.equipment, show: hasEquipment },
    { id: "gallery", label: T.gallery, show: hasGallery },
    { id: "projects", label: T.projects, show: hasProjects },
    { id: "team", label: T.team, show: hasTeam },
    { id: "contact", label: T.contact, show: true },
  ].filter((n) => n.show), [hasCapabilities, hasEquipment, hasGallery, hasProjects, hasTeam]);

  const [active, setActive] = useState("overview");
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-40px" });

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    nav.forEach((n) => { const el = document.getElementById(n.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [nav]);

  return (
    <div className="lab-page relative">
      {/* ── Cinematic hero ── */}
      <div className="relative" style={{ height: "clamp(340px, 48vh, 540px)" }}>
        {lab.coverImage ? (
          <Image src={lab.coverImage} alt={lab.name} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0" style={{
            backgroundImage: [
              "radial-gradient(ellipse 60% 90% at 80% 0%, rgba(56,189,248,0.30), transparent 60%)",
              "radial-gradient(ellipse 50% 80% at 10% 100%, rgba(16,185,129,0.18), transparent 55%)",
              "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.03) 28px, rgba(255,255,255,0.03) 29px)",
              "repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(255,255,255,0.03) 28px, rgba(255,255,255,0.03) 29px)",
              "linear-gradient(135deg, #0a1f3a 0%, #061631 60%, #04101f 100%)",
            ].join(", "),
          }} />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(4,12,26,0.30) 0%, rgba(4,12,26,0.55) 50%, rgba(4,12,26,0.96) 100%)" }} />

        <div className="absolute top-0 inset-x-0 px-4 sm:px-6 lg:px-8 pt-6 max-w-7xl mx-auto">
          <Link href={`/${locale}/divisions`} className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:gap-3" style={{ color: "rgba(125,211,252,0.9)" }}>
            <ArrowLeft size={16} /> {backLabel}
          </Link>
        </div>

        <div className="absolute bottom-0 inset-x-0 px-4 sm:px-6 lg:px-8 pb-9 max-w-7xl mx-auto">
          <div className="flex items-end gap-5">
            {lab.logo && (
              <div className="w-16 h-16 rounded-2xl items-center justify-center flex-shrink-0 hidden sm:flex" style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(10px)" }}>
                <Image src={lab.logo} alt={lab.name} width={44} height={44} className="object-contain" />
              </div>
            )}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl mb-3" style={{ background: "rgba(4,12,26,0.82)", border: "1px solid rgba(56,189,248,0.4)", backdropFilter: "blur(8px)" }}>
                <span className="w-1.5 h-1.5 rounded-full lab-active-dot" style={{ background: "#22C55E" }} />
                <span className="font-mono text-[11px] font-bold tracking-widest" style={{ color: "#7dd3fc" }}>LABORATORIYA · AKTIV</span>
              </div>
              <h1 className="font-display font-bold text-white leading-tight" style={{ fontSize: "clamp(26px, 4vw, 48px)", textShadow: "0 2px 20px rgba(0,0,0,0.6)" }}>{lab.name}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky sub-nav ── */}
      <div className="sticky top-[76px] z-30 -mt-px">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl px-2 py-1.5 overflow-x-auto flex gap-1" style={{ boxShadow: "var(--card-shadow)" }}>
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors"
                style={active === n.id ? { background: "rgba(var(--accent-rgb),0.14)", color: "var(--accent)" } : { color: "var(--content-secondary)" }}>
                {tr(n.label, locale)}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">

        {/* Stats */}
        {lab.stats.length > 0 && (
          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {lab.stats.map((s, i) => (
              <div key={s.id} className="relative">
                <StatCard s={s} rgb={rgbAt(i)} inView={statsInView} i={i} />
                <p className="text-[11px] mt-1.5 px-1 leading-snug" style={{ color: "var(--content-muted)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Overview */}
        <section id="overview" className="scroll-mt-32">
          <Reveal>
            <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
              <div>
                <div className="glass-card rounded-2xl p-6 mb-6" style={{ borderLeft: "3px solid rgba(var(--accent-rgb),0.6)", boxShadow: "var(--card-shadow)" }}>
                  <p className="leading-relaxed" style={{ color: "var(--content-secondary)", fontSize: "17px" }}>{lab.shortDescription}</p>
                </div>
                {lab.fullDescription && (
                  <div className="glass-card rounded-2xl p-6" style={{ boxShadow: "var(--card-shadow)" }}>
                    <p className="text-sm leading-[1.85] whitespace-pre-line" style={{ color: "var(--content-secondary)" }}>{lab.fullDescription}</p>
                  </div>
                )}
              </div>
              {/* Leader + contact sidebar */}
              <div className="space-y-4">
                {lab.leaderName && (
                  <div className="glass-card rounded-2xl p-5" style={{ boxShadow: "var(--card-shadow)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4" style={{ color: "var(--accent)" }}>{tr(T.leader, locale)}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, rgba(var(--accent-2-rgb),0.35), rgba(var(--accent-rgb),0.2))", border: "1px solid rgba(var(--accent-rgb),0.35)", color: "var(--accent)" }}>{lab.leaderName.charAt(0).toUpperCase()}</div>
                      <div>
                        <p className="font-semibold" style={{ color: "var(--content)" }}>{lab.leaderName}</p>
                        {lab.leaderPosition && <p className="text-xs mt-0.5" style={{ color: "var(--content-muted)" }}>{lab.leaderPosition}</p>}
                      </div>
                    </div>
                  </div>
                )}
                <Link href={`/${locale}/contact`} className="flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-2xl font-semibold text-sm text-white transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: "var(--warm-btn)", boxShadow: "0 8px 28px rgba(var(--warm-glow),0.36)" }}>
                  {tr(T.cta, locale)} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Capabilities */}
        {hasCapabilities && (
          <section id="capabilities" className="scroll-mt-32">
            <Reveal><SectionTitle>{tr(T.capabilitiesTitle, locale)}</SectionTitle></Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lab.capabilities.map((c, i) => {
                const rgb = rgbAt(i);
                return (
                  <Reveal key={c.id} delay={i * 0.05}>
                    <div className="group glass-card rounded-2xl p-5 h-full transition-all duration-300 hover:-translate-y-1" style={{ border: `1px solid rgba(${rgb},0.2)`, boxShadow: "var(--card-shadow)" }}>
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110" style={{ background: `rgba(${rgb},0.14)`, border: `1px solid rgba(${rgb},0.3)` }}>
                        {(() => { const Icon = resolveIcon(c.icon) ?? Cog; return <Icon size={24} style={{ color: `rgb(${rgb})` }} />; })()}
                      </span>
                      <p className="font-medium text-content leading-snug" style={{ fontSize: "15px" }}>{c.title}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>
        )}

        {/* Equipment */}
        {hasEquipment && (
          <section id="equipment" className="scroll-mt-32">
            <Reveal><SectionTitle>{tr(T.equipmentTitle, locale)}</SectionTitle></Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lab.equipment.map((e, i) => {
                const rgb = rgbAt(i);
                return (
                  <Reveal key={e.id} delay={i * 0.05}>
                    <div className="group glass-card rounded-2xl overflow-hidden h-full transition-all duration-300 hover:-translate-y-1" style={{ border: `1px solid rgba(${rgb},0.2)`, boxShadow: "var(--card-shadow)" }}>
                      <div className="relative flex items-center justify-center" style={{ aspectRatio: "16/10", background: `linear-gradient(135deg, rgba(${rgb},0.16), rgba(${rgb},0.04))` }}>
                        {e.image ? (
                          <Image src={e.image} alt={e.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (() => {
                          const Icon = resolveIcon(e.icon) ?? Cog;
                          return <Icon size={54} strokeWidth={1.3} style={{ color: `rgb(${rgb})` }} className="transition-transform duration-500 group-hover:scale-110" />;
                        })()}
                        {e.model_name && (
                          <span className="absolute top-3 left-3 text-[10px] font-mono font-bold px-2 py-1 rounded-md" style={{ background: "rgba(255,255,255,0.9)", color: `rgb(${rgb})` }}>{e.model_name}</span>
                        )}
                      </div>
                      <div className="p-4"><p className="font-semibold text-content text-sm">{e.name}</p></div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>
        )}

        {/* Gallery */}
        {hasGallery && (
          <section id="gallery" className="scroll-mt-32">
            <Reveal><SectionTitle>{tr(T.gallery, locale)}</SectionTitle></Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {lab.gallery.map((g, i) => (
                <Reveal key={g.id} delay={i * 0.04}>
                  <div className={`relative rounded-2xl overflow-hidden ${i === 0 ? "col-span-2 row-span-2" : ""}`} style={{ aspectRatio: i === 0 ? "16/10" : "1", border: `1px solid rgba(${rgbAt(i)},0.2)` }}>
                    <Image src={g.image} alt={g.caption || lab.name} fill className="object-cover" sizes={i === 0 ? "50vw" : "25vw"} />
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Related projects */}
        {hasProjects && (
          <section id="projects" className="scroll-mt-32">
            <Reveal><SectionTitle>{tr(T.projectsTitle, locale)}</SectionTitle></Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {lab.relatedProjects.map((p, i) => {
                const rgb = rgbAt(i);
                return (
                  <Reveal key={p.id} delay={i * 0.06}>
                    <Link href={`/${locale}/projects`} className="group glass-card rounded-2xl overflow-hidden h-full block" style={{ border: `1px solid rgba(${rgb},0.2)`, boxShadow: "var(--card-shadow)" }}>
                      {p.main_image && (
                        <div className="relative" style={{ aspectRatio: "16/10" }}>
                          <Image src={mediaUrl(p.main_image)} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2.5">
                          <CheckCircle2 size={15} style={{ color: `rgb(${rgb})` }} />
                          {p.completed_date && (
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md" style={{ background: `rgba(${rgb},0.15)`, color: `rgb(${rgb})` }}>{formatDate(p.completed_date, locale)}</span>
                          )}
                        </div>
                        <p className="text-sm font-medium leading-relaxed text-content">{p.name}</p>
                        {p.location && <p className="text-xs mt-1.5" style={{ color: "var(--content-muted)" }}>{p.location}</p>}
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </section>
        )}

        {/* Standards */}
        {hasStandards && (
          <section className="scroll-mt-32">
            <Reveal><SectionTitle>{tr(T.standardsTitle, locale)}</SectionTitle></Reveal>
            <Reveal>
              <div className="flex flex-wrap gap-3">
                {lab.standards.map((s) => (
                  <span key={s.id} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card font-semibold text-sm text-content" style={{ border: "1px solid rgba(var(--accent-rgb),0.25)", boxShadow: "var(--card-shadow)" }}>
                    <Award size={16} style={{ color: "var(--accent)" }} /> {s.name}
                  </span>
                ))}
              </div>
            </Reveal>
          </section>
        )}

        {/* Team */}
        {hasTeam && (
          <section id="team" className="scroll-mt-32">
            <Reveal><SectionTitle>{tr(T.teamTitle, locale)}</SectionTitle></Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {lab.leaderName && (
                <Reveal>
                  <div className="glass-card rounded-2xl p-5 flex items-center gap-4" style={{ border: "1px solid rgba(var(--accent-rgb),0.25)", boxShadow: "var(--card-shadow)" }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, rgba(var(--accent-2-rgb),0.35), rgba(var(--accent-rgb),0.2))", border: "1px solid rgba(var(--accent-rgb),0.35)", color: "var(--accent)" }}>{lab.leaderName.charAt(0).toUpperCase()}</div>
                    <div><p className="font-semibold text-content">{lab.leaderName}</p><p className="text-xs mt-0.5" style={{ color: "var(--accent)" }}>{lab.leaderPosition || tr(T.leader, locale)}</p></div>
                  </div>
                </Reveal>
              )}
              {lab.teamMembers.map((m, i) => (
                <Reveal key={m.id} delay={(i + 1) * 0.06}>
                  <div className="glass-card rounded-2xl p-5 flex items-center gap-4" style={{ boxShadow: "var(--card-shadow)" }}>
                    {m.photo ? (
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0"><Image src={m.photo} alt={m.name || m.position} fill className="object-cover" /></div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(var(--accent-rgb),0.12)", border: "1px solid rgba(var(--accent-rgb),0.2)" }}><User size={24} style={{ color: "var(--accent)" }} /></div>
                    )}
                    <div><p className="font-semibold" style={{ color: "var(--content-secondary)" }}>{m.name || "—"}</p><p className="text-xs mt-0.5" style={{ color: "var(--content-muted)" }}>{m.position}</p></div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Contact + CTA */}
        <section id="contact" className="scroll-mt-32">
          <Reveal>
            <div className="cta-flow-border">
              <div className="rounded-3xl p-8 sm:p-12 text-center" style={{ background: "var(--card-solid)", backdropFilter: "blur(20px)" }}>
                <h2 className="font-display font-bold text-content mb-3" style={{ fontSize: "clamp(22px,3vw,34px)" }}>{tr(T.contact, locale)}</h2>
                <p className="mb-7 max-w-xl mx-auto" style={{ color: "var(--content-secondary)" }}>{tr(T.ctaText, locale)}</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {lab.contactPhone && (
                    <a href={`tel:${lab.contactPhone}`} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm glass-card text-content" style={{ border: "1px solid rgba(var(--accent-rgb),0.25)" }}><Phone size={16} style={{ color: "var(--accent)" }} /> {lab.contactPhone}</a>
                  )}
                  {lab.contactEmail && (
                    <a href={`mailto:${lab.contactEmail}`} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm glass-card text-content" style={{ border: "1px solid rgba(var(--accent-rgb),0.25)" }}><Mail size={16} style={{ color: "var(--accent)" }} /> {lab.contactEmail}</a>
                  )}
                  <Link href={`/${locale}/contact`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white" style={{ background: "var(--warm-btn)", boxShadow: "0 8px 24px rgba(var(--warm-glow),0.34)" }}>{tr(T.cta, locale)} <ArrowRight size={16} /></Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
