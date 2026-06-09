import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ICHAB — Sanoat avtomatizatsiyasi",
    template: "%s | ICHAB",
  },
  description:
    "PLC, SCADA, sensorlar va boshqaruv tizimlari bo'yicha turnkey yechimlar. O'zbekiston sanoatini xalqaro standartlarga mos modernizatsiya.",
  keywords: ["PLC", "SCADA", "avtomatizatsiya", "sensorlar", "industrial automation", "Uzbekistan"],
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    siteName: "ICHAB",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
