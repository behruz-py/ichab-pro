"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function StatsProgressNav({ sections }: { sections: { id: string; label: string }[] }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [sections]);

  return (
    <>
      {/* top scroll-progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left"
        style={{ scaleX, background: "linear-gradient(90deg,#3B82F6,#22D3EE,#34D399)", boxShadow: "0 0 10px rgba(34,211,238,0.6)" }} />

      {/* side dot-nav (large screens) */}
      <nav className="hidden xl:flex flex-col gap-3.5 fixed right-7 top-1/2 -translate-y-1/2 z-40">
        {sections.map((s) => {
          const on = active === s.id;
          return (
            <a key={s.id} href={`#${s.id}`} className="group relative flex items-center justify-end gap-2.5" aria-label={s.label}>
              <span className="pointer-events-none opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-[13px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap glass-card"
                style={{ color: "var(--content)" }}>
                {s.label}
              </span>
              <span className="rounded-full transition-all duration-300"
                style={{
                  width: on ? 12 : 9, height: on ? 12 : 9,
                  background: on ? "var(--accent)" : "rgba(var(--accent-rgb),0.35)",
                  boxShadow: on ? "0 0 12px var(--accent)" : "none",
                }} />
            </a>
          );
        })}
      </nav>
    </>
  );
}
