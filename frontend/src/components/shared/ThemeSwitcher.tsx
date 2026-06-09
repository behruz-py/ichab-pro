"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={cn("w-9 h-9 rounded-lg glass-card animate-pulse", className)} />;
  }

  const isDark = theme === "midnight";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "midnight")}
      title={isDark ? "Light mode" : "Dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
        "border border-white/[0.09] bg-white/[0.05] backdrop-blur-sm",
        "hover:border-accent/40 hover:bg-accent/8 hover:text-accent",
        className
      )}
    >
      {isDark ? (
        <Sun size={16} className="text-accent" />
      ) : (
        <Moon size={16} className="text-content-secondary" />
      )}
    </button>
  );
}
