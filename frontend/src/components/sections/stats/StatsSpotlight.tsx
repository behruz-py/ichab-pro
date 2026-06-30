"use client";

import { useEffect } from "react";

/** Cursor-following spotlight: sets --mx/--my on the hovered .glass-card. */
export function StatsSpotlight() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".stats-page");
    if (!root || window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(".glass-card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    root.addEventListener("mousemove", onMove);
    return () => root.removeEventListener("mousemove", onMove);
  }, []);
  return null;
}
