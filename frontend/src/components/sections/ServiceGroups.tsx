"use client";

import { motion } from "framer-motion";
import { Check, Cog } from "lucide-react";
import { staggerContainer, fadeUp, VIEWPORT } from "@/lib/motion";
import { resolveIcon } from "@/components/ui/DynamicIcon";
import type { Service } from "@/types/api";

type Loc = Record<string, string>;
const tr = (o: Loc, locale: string) => o[locale] ?? o.uz;
const UNIT: Loc = { uz: "xizmat", ru: "услуги", en: "services" };
const OTHER: Loc = { uz: "Boshqa xizmatlar", ru: "Другие услуги", en: "Other services" };

// Rotating accent palette — each division group gets its own color, no admin
// configuration needed.
const PALETTE = ["59,130,246", "6,182,212", "139,92,246", "14,165,233", "16,185,129", "245,158,11", "236,72,153"];

interface Group {
  key: string;
  title: string;
  icon: string;
  items: Service[];
}

function groupByDivision(services: Service[], locale: string): Group[] {
  const map = new Map<string, Group>();
  for (const s of services) {
    const key = s.division ? String(s.division) : "other";
    const title = s.division_name || tr(OTHER, locale);
    const existing = map.get(key);
    if (existing) {
      existing.items.push(s);
    } else {
      map.set(key, { key, title, icon: s.icon, items: [s] });
    }
  }
  return Array.from(map.values());
}

/** Real, backend-driven services grouped by their division — replaces what
 * used to be a hardcoded GROUPS array. */
export function ServiceGroups({ services, locale }: { services: Service[]; locale: string }) {
  const groups = groupByDivision(services, locale);
  if (groups.length === 0) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {groups.map((g, i) => {
        const rgb = PALETTE[i % PALETTE.length];
        const grad = `linear-gradient(135deg, rgb(${rgb}) 0%, rgba(${rgb},0.62) 100%)`;
        const Icon = resolveIcon(g.icon) ?? Cog;
        return (
          <motion.div
            key={g.key}
            variants={fadeUp}
            className="group relative flex flex-col rounded-2xl p-6 overflow-hidden transition-transform duration-300 hover:-translate-y-1.5"
            style={{
              background: `linear-gradient(155deg, rgba(${rgb},0.15) 0%, rgba(255,255,255,0) 52%), var(--card-bg)`,
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            <span className="absolute top-0 inset-x-0 h-[3px]" style={{ background: grad }} />

            <motion.div
              className="absolute pointer-events-none"
              style={{ right: -18, bottom: -18 }}
              animate={{ y: [0, -7, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon
                className="transition-all duration-500 group-hover:scale-110 group-hover:opacity-[0.12]"
                style={{ width: 130, height: 130, color: `rgb(${rgb})`, opacity: 0.07 }}
                strokeWidth={1}
              />
            </motion.div>

            <span className="absolute inset-y-0 left-0 w-1/3 pointer-events-none skew-x-12 -translate-x-[160%] group-hover:translate-x-[420%] transition-transform duration-[900ms] ease-out"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />

            <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ boxShadow: `inset 0 0 0 1px rgba(${rgb},0.55), 0 18px 44px rgba(${rgb},0.30)` }} />

            <div className="relative flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center rounded-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                style={{ width: 48, height: 48, background: grad, boxShadow: `0 8px 20px rgba(${rgb},0.3)` }}>
                <Icon size={24} color="#fff" strokeWidth={1.7} />
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold leading-snug text-content" style={{ fontSize: 16.5 }}>
                  {g.title}
                </h3>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wide"
                  style={{ background: `rgba(${rgb},0.15)`, color: `rgb(${rgb})` }}>
                  {g.items.length} {tr(UNIT, locale)}
                </span>
              </div>
            </div>

            <ul className="relative flex flex-col gap-3">
              {g.items.map((svc) => (
                <li key={svc.id} className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center rounded-md flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110"
                    style={{ width: 18, height: 18, background: `rgba(${rgb},0.15)` }}>
                    <Check size={12} color={`rgb(${rgb})`} strokeWidth={3} />
                  </span>
                  <span className="leading-relaxed" style={{ fontSize: 13.5, color: "var(--content-secondary)" }}>
                    {svc.name}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
