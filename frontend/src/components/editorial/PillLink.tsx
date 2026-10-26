import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

/** Pill button: on hover the arrow's circle floods the whole pill and the
 * arrow slides out as a fresh one slides in. Nothing follows the cursor. */
export function PillLink({ href, children, variant = "solid" }: { href: string; children: ReactNode; variant?: "solid" | "ghost" }) {
  const solid = variant === "solid";
  return (
    <Link href={href}
      className={`group relative isolate inline-flex items-center gap-3 pl-7 pr-2 py-2 rounded-full overflow-hidden font-semibold text-base transition-[color,box-shadow] duration-500 ${
        solid ? "text-white hover:shadow-[0_18px_50px_rgba(var(--warm-glow),0.5)]" : "text-white/85 hover:text-[#0b1424]"}`}
      style={solid
        ? { background: "var(--warm-btn)", boxShadow: "0 14px 40px rgba(var(--warm-glow),0.35)" }
        : { border: "1px solid rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}>
      {/* Flood circle, anchored behind the arrow */}
      <span aria-hidden
        className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full -z-10 scale-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[9] motion-reduce:transition-none ${
          solid ? "bg-white/15" : "bg-white"}`} />
      <span>{children}</span>
      <span className={`relative flex items-center justify-center w-10 h-10 rounded-full overflow-hidden transition-colors duration-500 ${
        solid ? "bg-white/20" : "bg-white/10 group-hover:bg-[#0b1424] group-hover:text-white"}`}>
        <ArrowUpRight size={18} className="transition-transform duration-500 group-hover:translate-x-6 group-hover:-translate-y-6 motion-reduce:transition-none" />
        <ArrowUpRight size={18} className="absolute -translate-x-6 translate-y-6 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0 motion-reduce:transition-none" />
      </span>
    </Link>
  );
}
