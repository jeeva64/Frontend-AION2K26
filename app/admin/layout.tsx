import type { Metadata } from "next";

import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: {
    default: "Admin Portal",
    template: "%s | Admin",
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <AdminNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
