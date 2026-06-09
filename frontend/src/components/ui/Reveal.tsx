"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeIn, fadeLeft, fadeRight, scaleIn, VIEWPORT } from "@/lib/motion";
import type { HTMLMotionProps } from "framer-motion";

type Variant = "up" | "in" | "left" | "right" | "scale";

const variantMap = { up: fadeUp, in: fadeIn, left: fadeLeft, right: fadeRight, scale: scaleIn };

interface Props extends HTMLMotionProps<"div"> {
  variant?: Variant;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

export function Reveal({ variant = "up", delay = 0, className, children, ...rest }: Props) {
  const v = variantMap[variant];
  const withDelay = delay
    ? {
        ...v,
        visible: {
          ...v.visible,
          transition: {
            ...(v.visible as { transition?: object }).transition,
            delay,
          },
        },
      }
    : v;

  return (
    <motion.div
      variants={withDelay}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
