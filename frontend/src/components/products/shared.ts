// Plain (non-client) module so server components can read these values too;
// non-component exports of a "use client" file are opaque on the server.
import type { Availability, Product } from "@/types/api";

export const PRODUCT_PALETTE = ["245,158,11", "56,189,248", "16,185,129", "139,92,246", "236,72,153", "6,182,212"];

export const AVAIL_RGB: Record<Availability, string> = {
  available: "16,185,129",
  on_order: "245,158,11",
  discontinued: "148,163,184",
};

export const categoryIdOf = (p: Product) =>
  p.category == null ? null : typeof p.category === "number" ? p.category : p.category.id;
