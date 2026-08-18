"use client";

import { motion } from "framer-motion";

/** A decorative SVG ring that fills once `active` becomes true. Sits absolutely
 * behind whatever icon/content is layered on top of it. */
export function ProgressRing({
  progress,
  active,
  size = 44,
  strokeWidth = 3,
  rgb = "56,189,248",
}: {
  progress: number; // 0..1
  active: boolean;
  size?: number;
  strokeWidth?: number;
  rgb?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg
      width={size}
      height={size}
      className="absolute inset-0 -rotate-90 pointer-events-none"
      aria-hidden="true"
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`rgba(${rgb},0.15)`} strokeWidth={strokeWidth} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={`rgb(${rgb})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: active ? c * (1 - progress) : c }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      />
    </svg>
  );
}
