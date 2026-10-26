"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/types/api";
import { SectionLabel } from "@/components/editorial/SectionLabel";
import { EASE } from "@/components/editorial/hooks";

const PALETTE = ["56,189,248", "16,185,129", "139,92,246", "245,158,11", "236,72,153", "6,182,212"];
const OTHER: Record<string, string> = { uz: "Boshqa xizmatlar", ru: "Другие услуги", en: "Other services" };

interface Group { key: string; title: string; items: Service[] }

function groupByDivision(services: Service[], locale: string): Group[] {
  const map = new Map<string, Group>();
  for (const s of services) {
    const key = s.division ? String(s.division) : "other";
    const g = map.get(key);
    if (g) g.items.push(s);
    else map.set(key, { key, title: s.division_name || (OTHER[locale] ?? OTHER.uz), items: [s] });
  }
  return Array.from(map.values());
}

export function ServicesEditorial({
  index, label, locale, services, title, subtitle, viewAll,
}: {
  index: number; label: string; locale: string; services: Service[]; title: string; subtitle: string; viewAll: string;
}) {
  const groups = groupByDivision(services, locale);
  let n = 0;

  return (
    <section className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionLabel index={index} label={label} />
            <h2 className="font-display font-bold leading-[1.05] tracking-[-0.02em]" style={{ fontSize: "clamp(34px,4.2vw,64px)", color: "var(--content)" }}>{title}</h2>
            <p className="mt-5 max-w-md leading-relaxed" style={{ fontSize: 17, color: "var(--content-secondary)" }}>{subtitle}</p>
            <Link href={`/${locale}/services`} className="group inline-flex items-center gap-2 mt-8 text-sm font-semibold" style={{ color: "var(--accent)" }}>
              {viewAll} <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-14">
          {groups.map((g, gi) => {
            const c = PALETTE[gi % PALETTE.length];
            return (
              <div key={g.key}>
                <div className="flex items-center justify-between gap-4 pb-4" style={{ borderBottom: `1px solid rgba(${c},0.45)` }}>
                  <h3 className="flex items-center gap-3 font-display font-semibold leading-snug" style={{ fontSize: "clamp(17px,1.5vw,22px)", color: "var(--content)" }}>
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: `rgb(${c})`, boxShadow: `0 0 12px rgba(${c},0.6)` }} />
                    {g.title}
                  </h3>
                  <span className="font-mono text-xs font-bold shrink-0" style={{ color: `rgb(${c})` }}>{String(g.items.length).padStart(2, "0")}</span>
                </div>
                <ul>
                  {g.items.map((s) => {
                    const num = ++n;
                    return (
                      <motion.li key={s.id}
                        initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, ease: EASE }}
                        className="group grid grid-cols-[auto,1fr] gap-5 py-5 transition-colors duration-300"
                        style={{ borderBottom: "1px solid var(--border)" }}>
                        <span className="font-mono text-xs font-bold tabular-nums pt-1.5 transition-colors duration-300" style={{ color: "var(--content-muted)" }}>
                          {String(num).padStart(2, "0")}
                        </span>
                        <div className="transition-transform duration-500 group-hover:translate-x-1.5">
                          <p className="font-medium leading-snug first-letter:uppercase" style={{ fontSize: "clamp(16px,1.3vw,19px)", color: "var(--content)" }}>{s.name}</p>
                          {s.short_description && (
                            <p className="mt-1.5 text-sm leading-relaxed line-clamp-2" style={{ color: "var(--content-secondary)" }}>{s.short_description}</p>
                          )}
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
