"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Props {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    // Animate progress 0 → 100 over ~1.8s with easing
    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / duration, 1);
      // ease-out quart
      const eased = 1 - Math.pow(1 - elapsed, 3);
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
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
              style={{ background: "var(--accent-glow)", filter: "blur(80px)" }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px opacity-20 pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Outer ring */}
              <motion.div
                className="absolute -inset-4 rounded-full border border-accent/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              {/* Inner ring */}
              <motion.div
                className="absolute -inset-2 rounded-full border border-dashed border-accent/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />

              {/* Logo image or fallback */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center bg-white p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_0_24px_rgba(77,138,240,0.35)]">
                {!logoError ? (
                  <Image
                    src="/logo.png"
                    alt="ICHAB"
                    width={80}
                    height={80}
                    className="object-contain"
                    onError={() => setLogoError(true)}
                    priority
                  />
                ) : (
                  <span className="font-display font-bold text-2xl text-accent">IC</span>
                )}
              </div>
            </motion.div>

            {/* Company name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center"
            >
              <h1 className="font-display font-bold text-3xl text-content tracking-[0.2em] uppercase">
                ICHAB
              </h1>
              <p className="text-content-muted text-xs tracking-[0.15em] uppercase mt-1">
                Ishlab chiqarishni avtomatlashtirish
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="w-64"
            >
              <div className="flex justify-between text-xs text-content-muted mb-2 font-mono">
                <span>Initializing</span>
                <span>{progress}%</span>
              </div>

              {/* Track */}
              <div className="h-1 rounded-full bg-surface-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full relative overflow-hidden"
                  style={{
                    width: `${progress}%`,
                    background: "var(--accent-gradient)",
                  }}
                  transition={{ duration: 0.05 }}
                >
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-y-0 w-8 bg-white/30"
                    animate={{ left: ["-100%", "200%"] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
