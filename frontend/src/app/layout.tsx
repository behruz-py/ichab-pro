import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ICHAB — Sanoat avtomatizatsiyasi",
    template: "%s | ICHAB",
  },
  description:
    "PLC, SCADA, sensorlar va boshqaruv tizimlari bo'yicha turnkey yechimlar. O'zbekiston sanoatini xalqaro standartlarga mos modernizatsiya.",
  keywords: ["PLC", "SCADA", "avtomatizatsiya", "sensorlar", "industrial automation", "Uzbekistan"],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    siteName: "ICHAB",
    images: [{ url: "/favicon.png", width: 512, height: 512 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
