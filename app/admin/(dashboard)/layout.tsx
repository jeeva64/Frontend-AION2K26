import type { Metadata } from "next";
import { AdminProviders } from '../providers';
import { AdminLayout } from '@/components/admin/AdminLayout';

export const metadata: Metadata = {
  title: {
    default: "Super Admin Dashboard",
    template: "%s | Admin",
  },
};

export default function AdminLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminProviders>
      <AdminLayout>{children}</AdminLayout>
    </AdminProviders>
  );
}