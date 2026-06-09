"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerFast, fadeUp, VIEWPORT } from "@/lib/motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  fast?: boolean;
}

export function StaggerGrid({ children, className, fast }: Props) {
  return (
    <motion.div
      variants={fast ? staggerFast : staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}
