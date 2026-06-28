"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sparkles, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Toggles between the validated light "Soft Slate" theme and the dark
 * cinematic "Aurora Glass" theme. Renders a stable placeholder until mounted
 * to avoid a hydration mismatch (theme is only known on the client).
 */
export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={cn("w-8 h-8 rounded-lg glass-card animate-pulse", className)} />;
  }

  const isAurora = theme === "aurora";

  return (
    <button
      onClick={() => setTheme(isAurora ? "light" : "aurora")}
      title={isAurora ? "Yorug' uslub" : "Aurora (to'q) uslub"}
      aria-label={isAurora ? "Switch to light theme" : "Switch to Aurora dark theme"}
      className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
        "border border-black/[0.08] bg-black/[0.03] backdrop-blur-sm",
        "hover:border-accent/40 hover:bg-accent/[0.08] hover:text-accent",
        className
      )}
    >
      {isAurora ? (
        <Sun size={16} className="text-accent" />
      ) : (
        <Sparkles size={16} className="text-accent" />
      )}
    </button>
  );
}
