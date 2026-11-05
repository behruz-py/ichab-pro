"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Building2, MapPin, Plus } from "lucide-react";
import type { Project } from "@/types/api";
import { mediaUrl } from "@/lib/utils";
import { EASE } from "@/components/editorial/hooks";

const PALETTE = ["245,158,11", "56,189,248", "16,185,129", "139,92,246", "236,72,153", "6,182,212"];
const MONTHS: Record<string, string[]> = {
  uz: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
  ru: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};
const UNIT: Record<string, string> = { uz: "loyiha", ru: "проектов", en: "projects" };

// Dates are stored as the 1st of a month; January marks a year-only record.
function monthOf(d: string | null, locale: string) {
  if (!d) return null;
  const m = new Date(d).getUTCMonth();
  return m === 0 ? null : (MONTHS[locale] ?? MONTHS.uz)[m];
}

function Row({ p, n, rgb, locale, open, onToggle }: { p: Project; n: number; rgb: string; locale: string; open: boolean; onToggle: () => void }) {
  const [imgFailed, setImgFailed] = useState(false);
  const img = imgFailed ? null : p.main_image;
  const month = monthOf(p.completed_date, locale);
  const expandable = !!(p.description || img);

  return (
    <li style={{ borderBottom: "1px solid var(--border)" }}>
      <button type="button" onClick={onToggle} disabled={!expandable} aria-expanded={open}
        className="group w-full text-left grid grid-cols-[auto,1fr,auto] gap-x-5 sm:gap-x-8 py-6 sm:py-7 items-start disabled:cursor-default">
        <span className="font-mono text-xs font-bold tabular-nums pt-1.5" style={{ color: open ? `rgb(${rgb})` : "var(--content-muted)" }}>
          {String(n).padStart(2, "0")}
        </span>
        <span className="min-w-0">
          <span className="block font-display font-semibold leading-snug transition-colors duration-300 group-hover:text-[var(--accent)]"
            style={{ fontSize: "clamp(17px,1.5vw,23px)", color: "var(--content)" }}>{p.name}</span>
          <span className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-sm" style={{ color: "var(--content-secondary)" }}>
            {month && <span className="font-mono text-xs font-bold uppercase tracking-wide self-center px-2 py-0.5 rounded" style={{ color: `rgb(${rgb})`, background: `rgba(${rgb},0.12)` }}>{month}</span>}
            {p.client && <span className="inline-flex items-center gap-1.5"><Building2 size={14} />{p.client}</span>}
            {p.location && <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{p.location}</span>}
          </span>
        </span>
        {expandable ? (
          <span className="flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-500"
            style={{ borderColor: open ? "transparent" : "var(--border)", background: open ? `rgb(${rgb})` : "transparent", color: open ? "#fff" : "var(--content-secondary)", transform: open ? "rotate(45deg)" : "none" }}>
            <Plus size={18} />
          </span>
        ) : <span className="w-10" />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }} className="overflow-hidden">
            <div className={`pb-8 pl-[38px] sm:pl-[50px] grid gap-6 ${img ? "md:grid-cols-2" : ""}`}>
              {p.description && (
                <p className="leading-relaxed self-center" style={{ fontSize: "clamp(15px,1.1vw,17px)", color: "var(--content-secondary)" }}>{p.description}</p>
              )}
              {img && (
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden" style={{ background: "var(--surface-card)" }}>
                  <Image src={mediaUrl(img)} alt={p.name} fill sizes="(max-width:768px) 90vw, 40vw" className="object-cover" onError={() => setImgFailed(true)} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function YearBlock({ year, items, startN, rgb, locale, openId, setOpenId, onVisible }: {
  year: number; items: Project[]; startN: number; rgb: string; locale: string;
  openId: number | null; setOpenId: (id: number | null) => void; onVisible: (y: number) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const filled = useInView(ref, { once: true, amount: 0.25 });
  const active = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => { if (active) onVisible(year); }, [active, year, onVisible]);
  const yr = String(year);

  return (
    <section ref={ref} id={`year-${year}`} className="scroll-mt-40 grid lg:grid-cols-12 gap-x-12 gap-y-4 py-12 sm:py-16" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="lg:col-span-3">
        <div className="lg:sticky lg:top-36">
          <span className="relative inline-block font-display font-bold tabular-nums leading-none select-none" style={{ fontSize: "clamp(64px,7vw,120px)" }} aria-hidden>
            <span style={{ WebkitTextStroke: `1.5px rgba(${rgb},0.5)`, WebkitTextFillColor: "transparent", color: "transparent" }}>{yr}</span>
            <motion.span className="absolute inset-0" style={{ color: `rgb(${rgb})` }}
              initial={{ clipPath: "inset(100% 0 0 0)" }} animate={filled ? { clipPath: "inset(0% 0 0 0)" } : {}}
              transition={{ duration: 1.1, ease: EASE }}>{yr}</motion.span>
          </span>
          <h2 className="sr-only">{yr}</h2>
          <p className="mt-3 text-xs uppercase tracking-[0.2em]" style={{ color: "var(--content-muted)" }}>
            <span className="font-mono font-bold" style={{ color: "var(--content)" }}>{items.length}</span> {UNIT[locale] ?? UNIT.uz}
          </p>
        </div>
      </div>
      <ol className="lg:col-span-9">
        {items.map((p, i) => (
          <Row key={p.id} p={p} n={startN + i} rgb={rgb} locale={locale}
            open={openId === p.id} onToggle={() => setOpenId(openId === p.id ? null : p.id)} />
        ))}
      </ol>
    </section>
  );
}

/** Projects grouped by completion year, newest first: a sticky year index on
 * top, outline years that fill as they scroll in, and expandable rows. */
export function ProjectsTimeline({ projects, locale }: { projects: Project[]; locale: string }) {
  const groups = useMemo(() => {
    const m = new Map<number, Project[]>();
    for (const p of projects) {
      if (!p.completed_date) continue;
      const y = new Date(p.completed_date).getUTCFullYear();
      m.set(y, [...(m.get(y) ?? []), p]);
    }
    return [...m.entries()].sort((a, b) => b[0] - a[0])
      .map(([year, items]) => ({ year, items: items.sort((a, b) => (b.completed_date ?? "").localeCompare(a.completed_date ?? "")) }));
  }, [projects]);
  const undated = projects.filter((p) => !p.completed_date);

  const [openId, setOpenId] = useState<number | null>(null);
  const [current, setCurrent] = useState<number | null>(groups[0]?.year ?? null);
  const stripRef = useRef<HTMLDivElement>(null);

  // Keep the active year chip in view as the page scrolls (matters on phones).
  useEffect(() => {
    const strip = stripRef.current;
    const chip = strip?.querySelector<HTMLElement>(`[data-year="${current}"]`);
    if (!strip || !chip) return;
    const left = chip.offsetLeft - strip.offsetLeft;
    if (left < strip.scrollLeft || left + chip.offsetWidth > strip.scrollLeft + strip.clientWidth) {
      strip.scrollTo({ left: left - 16, behavior: "smooth" });
    }
  }, [current]);

  let n = 0;
  return (
    <div>
      {/* Year index */}
      <nav className="sticky top-16 z-20 -mx-4 px-4 sm:mx-0 sm:px-0 py-3 mb-2 backdrop-blur-md" style={{ background: "rgba(var(--surface-rgb),0.82)" }}>
        <div ref={stripRef} className="relative flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {groups.map(({ year, items }, gi) => {
            const on = current === year;
            const rgb = PALETTE[gi % PALETTE.length];
            return (
              <a key={year} href={`#year-${year}`} data-year={year} aria-current={on ? "true" : undefined}
                className="shrink-0 inline-flex items-baseline gap-1.5 px-4 py-2 rounded-full transition-all duration-300"
                style={on ? { background: `rgb(${rgb})`, color: "#fff" } : { border: "1px solid var(--border)", color: "var(--content-secondary)" }}>
                <span className="font-display font-bold tabular-nums">{year}</span>
                <span className="font-mono text-[11px] font-bold opacity-75">{items.length}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {groups.map(({ year, items }, gi) => {
        const start = n + 1; n += items.length;
        return (
          <YearBlock key={year} year={year} items={items} startN={start} rgb={PALETTE[gi % PALETTE.length]} locale={locale}
            openId={openId} setOpenId={setOpenId} onVisible={setCurrent} />
        );
      })}

      {undated.length > 0 && (
        <ol className="py-12" style={{ borderTop: "1px solid var(--border)" }}>
          {undated.map((p, i) => (
            <Row key={p.id} p={p} n={n + i + 1} rgb={PALETTE[0]} locale={locale} open={openId === p.id} onToggle={() => setOpenId(openId === p.id ? null : p.id)} />
          ))}
        </ol>
      )}
    </div>
  );
}
