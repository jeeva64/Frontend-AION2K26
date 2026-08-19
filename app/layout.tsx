import type { Metadata, Viewport } from "next";
import { Outfit, Geist_Mono, Orbitron, Rajdhani } from "next/font/google";
import { ToasterWrapper } from "@/components/ui/ToasterClient";

import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AION 2K26 | National Level Technical Symposium",
    template: "%s | AION 2K26",
  },
  description:
    "AION 2K26 — National Level Technical Symposium. Compete in Fixathon, Bid Mayhem, Mute Masters, Treasure Titans, QRush, VisionX, ThinkSync and Crazy Sell.",
  icons: {
    icon: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistMono.variable} ${orbitron.variable} ${rajdhani.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ToasterWrapper />
      </body>
    </html>
  );
}
