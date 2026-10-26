"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/** Pill button that leans toward the cursor and springs back when it leaves. */
export function MagneticLink({ href, children, variant = "solid" }: { href: string; children: ReactNode; variant?: "solid" | "ghost" }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  const solid = variant === "solid";
  return (
    <motion.div style={{ x: sx, y: sy }} className="inline-block"
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.35);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}>
      <Link href={href}
        className={`group inline-flex items-center gap-3 pl-7 pr-2.5 py-2.5 rounded-full font-semibold text-base transition-colors duration-300 ${solid ? "text-white" : "text-white/85 hover:text-white"}`}
        style={solid
          ? { background: "var(--warm-btn)", boxShadow: "0 16px 44px rgba(var(--warm-glow),0.40)" }
          : { border: "1px solid rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}>
        {children}
        <span className={`flex items-center justify-center w-10 h-10 rounded-full transition-transform duration-500 group-hover:rotate-45 ${solid ? "bg-white/20" : "bg-white/10"}`}>
          <ArrowUpRight size={19} />
        </span>
      </Link>
    </motion.div>
  );
}
