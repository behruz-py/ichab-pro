"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const ITEMS = [
  { text: "ISO 9001:2015" },
  { text: "25+ yil tajriba" },
  { text: "150+ bajarilgan loyiha" },
  { text: "PLC · SCADA · HMI" },
  { text: "24/7 texnik yordam" },
  { text: "Xalqaro standartlar" },
  { text: "O'zbekiston bo'ylab xizmat" },
  { text: "Sertifikatlangan mutaxassislar" },
];

// Duplicate for infinite loop
const TRACK = [...ITEMS, ...ITEMS, ...ITEMS];

export function TrustStrip() {
  return (
    <div className="relative overflow-hidden py-4" style={{ borderTop: "1px solid rgba(var(--accent-rgb),0.10)", borderBottom: "1px solid rgba(var(--accent-rgb),0.10)", background: "rgba(var(--surface-2-rgb),0.60)" }}>

      {/* Edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-32 z-10"
        style={{ background: "linear-gradient(to right, rgba(var(--surface-2-rgb),0.95) 0%, transparent 100%)" }} />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-32 z-10"
        style={{ background: "linear-gradient(to left, rgba(var(--surface-2-rgb),0.95) 0%, transparent 100%)" }} />

      {/* Scrolling track */}
      <div
        className="flex items-center gap-0 whitespace-nowrap"
        style={{ animation: "marquee 32s linear infinite", width: "max-content" }}
      >
        {TRACK.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-6">
            <ShieldCheck size={13} style={{ color: "var(--accent)", flexShrink: 0 }} />
            <span
              style={{
                color: i % (ITEMS.length * 2) < ITEMS.length ? "var(--content-secondary)" : "var(--accent)",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.04em",
              }}
            >
              {item.text}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
