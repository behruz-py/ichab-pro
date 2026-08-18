"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";

/**
 * A vertical accent line that "draws" itself down the left gutter of a content
 * column as the reader scrolls through it — a subtle "journey" cue. Desktop
 * only (the gutter doesn't exist on narrow layouts).
 */
export function SectionPathLine({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) {
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end center"] });
  const nodes = [0.08, 0.5, 0.92];

  return (
    <svg
      className="hidden lg:block absolute -left-10 top-0 h-full w-6 pointer-events-none"
      width="24"
      viewBox="0 0 24 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="path-line-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(var(--accent-rgb),0.05)" />
          <stop offset="50%" stopColor="rgba(var(--accent-rgb),0.55)" />
          <stop offset="100%" stopColor="rgba(var(--accent-2-rgb),0.55)" />
        </linearGradient>
      </defs>
      <line x1="12" y1="0" x2="12" y2="100" stroke="rgba(100,116,139,0.10)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <motion.line
        x1="12" y1="0" x2="12" y2="100"
        stroke="url(#path-line-gradient)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: scrollYProgress }}
      />
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx="12"
          cy={n * 100}
          r="3"
          fill="rgb(var(--accent-rgb))"
          initial={{ opacity: 0.15, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40% 0px -40% 0px" }}
          transition={{ duration: 0.4 }}
          style={{ transformOrigin: "12px " + n * 100 + "px" }}
        />
      ))}
    </svg>
  );
}
