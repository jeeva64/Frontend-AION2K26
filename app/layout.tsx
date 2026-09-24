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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "AION 2K26 2.0 | State Level Technical Symposium",
    template: "%s | AION 2K26 2.0",
  },
  description:
    "AION 2K26 2.0 - State Level Technical Symposium by Dept. of AI, St. Joseph's College (Autonomous), Tiruchirappalli. October 7, 2026. Compete in Fixathon, Bid Mayhem, Mute Masters, Treasure Titans, QRush, VisionX, ThinkSync and Crazy Sell.",
  openGraph: {
    type: "website",
    siteName: "AION 2K26 2.0",
    title: "AION 2K26 2.0 | State Level Technical Symposium",
    description:
      "State Level Technical Symposium by Dept. of AI, St. Joseph's College (Autonomous), Tiruchirappalli. October 7, 2026 - 8 events, ₹200 per participant.",
    url: "/",
    images: [
      {
        url: "/aion-2k26-invite.jpg",
        width: 1600,
        height: 1086,
        alt: "AION 2K26 2.0 Invitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AION 2K26 2.0 | State Level Technical Symposium",
    description:
      "Compete in 8 technical events at AION 2K26 2.0 - October 7, 2026.",
    images: ["/aion-2k26-invite.jpg"],
  },
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
