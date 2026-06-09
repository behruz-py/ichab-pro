"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  size?: number;
  className?: string;
}

export function LogoBadge({ size = 36, className = "" }: Props) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`rounded-lg bg-accent/15 border border-accent/35 flex items-center justify-center flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-accent font-display font-bold" style={{ fontSize: size * 0.35 }}>
          IC
        </span>
      </div>
    );
  }

  const padding = Math.round(size * 0.08);

  return (
    <div
      className={`relative rounded-xl overflow-hidden flex-shrink-0 bg-white
        ring-1 ring-white/20
        shadow-[0_2px_8px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.12)]
        group-hover:shadow-[0_0_0_1px_rgba(1,172,180,0.50),0_4px_16px_rgba(1,172,180,0.20)]
        transition-all duration-300 ${className}`}
      style={{ width: size, height: size, padding }}
    >
      <Image
        src="/logo.png"
        alt="ICHAB logo"
        width={size}
        height={size}
        className="object-contain w-full h-full"
        onError={() => setError(true)}
        priority
      />
    </div>
  );
}
