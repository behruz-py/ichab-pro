"use client";

import * as LucideIcons from "lucide-react";

interface Props {
  name: string;
  size?: number;
  className?: string;
}

function kebabToPascal(str: string) {
  return str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

export function DynamicIcon({ name, size = 22, className = "" }: Props) {
  const pascal = kebabToPascal(name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[pascal] as React.ComponentType<{ size?: number; className?: string }> | undefined;

  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}
