import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Variant = "hero" | "services" | "stats" | "about" | "contact" | "default";

type BlobStyle = CSSProperties & {
  width: string;
  height: string;
  background: string;
  filter: string;
  opacity: string;
};

const VARIANTS: Record<Variant, BlobStyle[]> = {
  hero: [
    { width: "700px", height: "700px", background: "var(--accent)", filter: "blur(140px)", opacity: "0.09", top: "-200px", right: "-100px" },
    { width: "500px", height: "500px", background: "var(--accent-secondary)", filter: "blur(120px)", opacity: "0.05", bottom: "-100px", left: "-150px" },
  ],
  services: [
    { width: "700px", height: "700px", background: "var(--accent)", filter: "blur(140px)", opacity: "0.07", top: "-200px", left: "-150px" },
    { width: "400px", height: "400px", background: "var(--accent-secondary)", filter: "blur(110px)", opacity: "0.04", bottom: "-80px", right: "-100px" },
  ],
  stats: [
    { width: "800px", height: "800px", background: "var(--accent)", filter: "blur(160px)", opacity: "0.06", top: "50%", left: "50%", transform: "translate(-50%,-50%)" },
  ],
  about: [
    { width: "500px", height: "500px", background: "var(--accent)", filter: "blur(120px)", opacity: "0.08", top: "-100px", right: "-80px" },
    { width: "350px", height: "350px", background: "var(--accent-secondary)", filter: "blur(100px)", opacity: "0.05", bottom: "-80px", left: "-60px" },
  ],
  contact: [
    { width: "600px", height: "600px", background: "var(--accent)", filter: "blur(140px)", opacity: "0.07", top: "-100px", left: "50%", transform: "translateX(-50%)" },
  ],
  default: [
    { width: "500px", height: "500px", background: "var(--accent)", filter: "blur(130px)", opacity: "0.07", top: "-100px", right: "-80px" },
    { width: "300px", height: "300px", background: "var(--accent-secondary)", filter: "blur(100px)", opacity: "0.04", bottom: "-60px", left: "-40px" },
  ],
};

interface Props {
  variant?: Variant;
  className?: string;
}

export function MeshBlobs({ variant = "default", className }: Props) {
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden pointer-events-none select-none", className)}
      aria-hidden
    >
      {VARIANTS[variant].map((style, i) => (
        <div key={i} className="absolute rounded-full" style={style} />
      ))}
    </div>
  );
}
