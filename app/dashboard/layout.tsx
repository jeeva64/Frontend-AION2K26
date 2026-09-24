import type { Metadata } from "next";
import { AnalyticsScripts } from "@/components/analytics";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AnalyticsScripts />
      {children}
    </>
  );
}
