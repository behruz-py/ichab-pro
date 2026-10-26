"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { SectionLabel } from "./SectionLabel";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

/** Long-form statement that lights up word by word as it scrolls through the viewport. */
export function MissionReveal({ index, label, body }: { index: number; label: string; body: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = body.split(/\s+/).filter(Boolean);

  return (
    <section className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-28"><SectionLabel index={index} label={label} /></div>
        </div>
        <p ref={ref} className="lg:col-span-9 font-display font-medium tracking-[-0.01em]"
          style={{ fontSize: "clamp(21px, 2.3vw, 36px)", lineHeight: 1.42, color: "var(--content)" }}>
          {reduce
            ? body
            : words.map((w, i) => (
                <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
              ))}
        </p>
      </div>
    </section>
  );
}
