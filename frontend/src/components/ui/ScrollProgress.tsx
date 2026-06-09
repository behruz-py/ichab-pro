"use client";

import { useScroll, motion } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[200] h-[2px] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: "var(--accent-gradient)",
        boxShadow: "0 0 8px var(--accent-glow)",
      }}
    />
  );
}
