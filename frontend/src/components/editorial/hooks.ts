"use client";

import { useEffect, useState, type RefObject } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

// AppLoader mounts the page with visibility:hidden behind the splash screen;
// entrance animations wait until the element is actually visible, or they
// play unseen.
export function useVisibleOnce(ref: RefObject<HTMLElement>) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      const el = ref.current;
      if (el && getComputedStyle(el).visibility === "visible") { setReady(true); return; }
      raf = requestAnimationFrame(check);
    };
    check();
    return () => cancelAnimationFrame(raf);
  }, [ref]);
  return ready;
}

export function useCountUp(target: number, run: boolean, dur: number) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(target); return; }
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, dur]);
  return v;
}
