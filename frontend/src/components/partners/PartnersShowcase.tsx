"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Partner } from "@/types/api";
import { mediaUrl } from "@/lib/utils";
import { EASE } from "@/components/editorial/hooks";

/**
 * Logo on a white plate (most uploaded logos carry an opaque white background,
 * so they can't sit on the themed surface). Logos are sized by area rather than
 * height, so a long wordmark and a square mark read with the same visual weight.
 */
function LogoPlate({ partner, fill, maxW, className = "" }: { partner: Partner; fill: number; maxW: string; className?: string }) {
  const [ratio, setRatio] = useState(2.5);
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [plateW, setPlateW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setPlateW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // Target logo area scales with the plate; `fill` is the side of an
  // equivalent square as a fraction of the plate width.
  const side = (plateW || 240) * fill;
  const h = Math.round(Math.sqrt((side * side) / ratio));

  return (
    <div ref={ref} className={`relative flex items-center justify-center rounded-2xl bg-white overflow-hidden ${className}`}
      style={{ boxShadow: "0 0 0 1px rgba(15,23,42,0.06), 0 10px 30px -18px rgba(15,23,42,0.35)" }}>
      {partner.logo && !failed ? (
        <Image src={mediaUrl(partner.logo)} alt={partner.name} width={640} height={320} sizes="240px"
          onLoad={(e) => { const i = e.currentTarget; if (i.naturalHeight) setRatio(i.naturalWidth / i.naturalHeight); }}
          onError={() => setFailed(true)}
          className="object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          style={{ height: h, width: "auto", maxWidth: maxW }} />
      ) : (
        <span className="font-display font-bold text-lg text-slate-800 px-4 text-center">{partner.name}</span>
      )}
    </div>
  );
}

function Meta({ partner }: { partner: Partner }) {
  return (
    <>
      {partner.country && (
        <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>{partner.country}</p>
      )}
      {partner.description && (
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--content-secondary)" }}>{partner.description}</p>
      )}
    </>
  );
}

/** Wraps a card in an outbound link only when the partner has a website. */
function MaybeLink({ partner, className, children }: { partner: Partner; className: string; children: React.ReactNode }) {
  return partner.website ? (
    <a href={partner.website} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
  ) : (
    <div className={className}>{children}</div>
  );
}

function VisitArrow({ partner }: { partner: Partner }) {
  if (!partner.website) return null;
  return (
    <span className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-slate-700 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:rotate-45">
      <ArrowUpRight size={15} />
    </span>
  );
}

export function TechnologyWall({ partners }: { partners: Partner[] }) {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-5 sm:gap-x-8 gap-y-10 sm:gap-y-14">
      {partners.map((p, i) => (
        <motion.li key={p.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: EASE }}>
          <MaybeLink partner={p} className="group block">
            <div className="relative">
              <LogoPlate partner={p} fill={0.36} maxW="80%" className="aspect-[16/10]" />
              <VisitArrow partner={p} />
            </div>
            <div className="mt-5">
              <h3 className="font-display font-semibold leading-snug transition-colors duration-300 group-hover:text-[var(--accent)]"
                style={{ fontSize: "clamp(16px,1.3vw,20px)", color: "var(--content)" }}>{p.name}</h3>
              <div className="mt-2"><Meta partner={p} /></div>
            </div>
          </MaybeLink>
        </motion.li>
      ))}
    </ul>
  );
}

export function IndustryList({ partners }: { partners: Partner[] }) {
  return (
    <ul style={{ borderTop: "1px solid var(--border)" }}>
      {partners.map((p, i) => (
        <motion.li key={p.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
          style={{ borderBottom: "1px solid var(--border)" }}>
          <MaybeLink partner={p} className="group grid grid-cols-[auto,1fr] sm:grid-cols-[auto,minmax(0,220px),1fr] items-center gap-x-5 sm:gap-x-10 gap-y-4 py-7 sm:py-9">
            <span className="font-mono text-xs font-bold tabular-nums row-start-1 self-center" style={{ color: "var(--content-muted)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="relative row-start-1 col-start-2 sm:row-start-auto sm:col-start-auto max-w-[220px]">
              <LogoPlate partner={p} fill={0.4} maxW="82%" className="h-28" />
              <VisitArrow partner={p} />
            </div>
            <div className="min-w-0 col-start-2 sm:col-start-auto">
              <h3 className="font-display font-semibold leading-tight transition-colors duration-300 group-hover:text-[var(--accent)]"
                style={{ fontSize: "clamp(22px,2.4vw,36px)", color: "var(--content)" }}>{p.name}</h3>
              <div className="mt-3 max-w-xl"><Meta partner={p} /></div>
            </div>
          </MaybeLink>
        </motion.li>
      ))}
    </ul>
  );
}
