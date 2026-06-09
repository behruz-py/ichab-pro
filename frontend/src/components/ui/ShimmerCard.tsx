"use client";

import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  speed?: "slow" | "normal" | "fast";
  intensity?: "subtle" | "normal" | "strong";
}

const SPEED = { slow: "9s", normal: "7s", fast: "5s" };
const OPACITY = { subtle: "0.14", normal: "0.24", strong: "0.42" };

export function ShimmerCard({
  children,
  className,
  innerClassName,
  speed = "normal",
  intensity = "normal",
}: Props) {
  return (
    <div
      className={cn("shimmer-wrapper", className)}
      style={
        {
          "--shimmer-speed": SPEED[speed],
          "--shimmer-opacity": OPACITY[intensity],
        } as React.CSSProperties
      }
    >
      <div className={cn("shimmer-inner", innerClassName)}>{children}</div>
    </div>
  );
}
