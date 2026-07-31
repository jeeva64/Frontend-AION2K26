"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { clearAllAuth, getAdminRole, getAdminToken } from "@/lib/auth";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      clearAllAuth();
      router.replace("/admin/login");
      return;
    }
    setRole(getAdminRole());
    setAuthed(true);
  }, [router]);

  if (!authed) {
    return null;
  }

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-8 text-center shadow-xl">
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-3 text-lg text-gray-500">
          {role === "1" ? "Super Admin" : "Moderator"} session active
        </p>
        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          The full dashboard (stats, view team, event regs, delete, export and
          add college) is coming next.
        </div>
      </div>
    </div>
  );
}
