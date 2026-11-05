"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

// Enter-only: AnimatePresence's exit step could get stuck when the next route
// suspends while loading, leaving the new page rendered inside the exiting
// wrapper at opacity 0. Re-keying on the path still replays the fade-in.
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
