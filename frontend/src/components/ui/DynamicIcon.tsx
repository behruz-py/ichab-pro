"use client";

import * as LucideIcons from "lucide-react";

interface Props {
  name?: string | null;
  size?: number;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

type IconComponent = React.ComponentType<{ size?: number; className?: string; strokeWidth?: number; style?: React.CSSProperties }>;

// Built once: a case/format-insensitive lookup so admin-entered icon names like
// "shield-check", "ShieldCheck" or "Shield Check" all resolve to the same icon.
const ICON_MAP: Record<string, IconComponent> = {};
for (const [key, value] of Object.entries(LucideIcons)) {
  if (typeof value === "function" || (typeof value === "object" && value !== null && "render" in value)) {
    ICON_MAP[key.toLowerCase()] = value as IconComponent;
  }
}

/** Resolve an admin-entered icon name to its component, or null if unmatched. */
export function resolveIcon(name?: string | null): IconComponent | null {
  if (!name) return null;
  return ICON_MAP[name.replace(/[\s_-]/g, "").toLowerCase()] ?? null;
}

export function DynamicIcon({ name, size = 22, className = "", strokeWidth, style }: Props) {
  const Icon = resolveIcon(name);
  if (!Icon) return null;
  return <Icon size={size} className={className} strokeWidth={strokeWidth} style={style} />;
}
