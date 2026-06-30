"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Props {
  onComplete?: () => void;
}

const R = 140;                       // ring radius
const CIRC = 2 * Math.PI * R;        // circumference

export function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const duration = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3); // ease-out
      setProgress(Math.round(eased * 100));
      if (elapsed < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setVisible(false);
          setTimeout(() => onComplete?.(), 400);
        }, 300);
      }
    };
    requestAnimationFrame(tick);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "var(--gradient)", backgroundAttachment: "fixed" }}
          aria-label="Yuklanmoqda"
        >
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full"
              style={{ background: "var(--accent-glow)", filter: "blur(90px)" }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.55, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-9">

            {/* ── Logo + circular progress ring ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center justify-center"
              style={{ width: 300, height: 300 }}
            >
              {/* Outer dashed deco ring — slow spin */}
              <motion.div
                className="absolute rounded-full border border-dashed"
                style={{ inset: -10, borderColor: "rgba(var(--accent-rgb),0.16)" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />

              {/* Progress ring */}
              <svg width="300" height="300" viewBox="0 0 300 300" className="absolute inset-0 -rotate-90">
                <defs>
                  <linearGradient id="ichab-load" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" />
                    <stop offset="60%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="var(--warm-solid)" />
                  </linearGradient>
                </defs>
                {/* Track */}
                <circle cx="150" cy="150" r={R} fill="none" stroke="rgba(var(--accent-rgb),0.12)" strokeWidth="5" />
                {/* Fill */}
                <circle
                  cx="150" cy="150" r={R} fill="none"
                  stroke="url(#ichab-load)" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC * (1 - progress / 100)}
                  style={{ filter: "drop-shadow(0 0 7px rgba(var(--accent-rgb),0.45))", transition: "stroke-dashoffset 0.12s linear" }}
                />
              </svg>

              {/* Logo — gentle breathing pulse */}
              <motion.div
                className="relative flex items-center justify-center"
                style={{
                  width: 200, height: 200,
                  filter: "drop-shadow(0 0 24px rgba(var(--accent-rgb),0.45)) drop-shadow(0 0 12px rgba(var(--warm-glow),0.22))",
                }}
                animate={{ scale: [1, 1.045, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                {!logoError ? (
                  <Image
                    src="/logo-icon.png"
                    alt="ICHAB"
                    width={200}
                    height={200}
                    className="object-contain w-full h-full"
                    onError={() => setLogoError(true)}
                    priority
                  />
                ) : (
                  <span className="font-display font-bold text-6xl text-accent">IC</span>
                )}
              </motion.div>
            </motion.div>

            {/* ── Company name ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center"
            >
              <h1 className="font-display font-bold text-4xl text-content tracking-[0.22em] uppercase">
                ICHAB
              </h1>
              <p className="text-content-muted text-xs tracking-[0.15em] uppercase mt-1.5">
                Ishlab chiqarishni avtomatlashtirish
              </p>
            </motion.div>

            {/* ── Big percentage ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="flex flex-col items-center gap-1"
            >
              <span
                className="font-display font-bold tabular-nums"
                style={{
                  fontSize: 34, lineHeight: 1,
                  background: "linear-gradient(120deg, var(--accent) 0%, var(--warm-solid) 120%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}
              >
                {progress}%
              </span>
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: "var(--content-muted)" }}>
                Initializing
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
