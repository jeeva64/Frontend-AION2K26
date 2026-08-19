"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { clearAllAuth, getAdminToken } from "@/lib/auth";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      clearAllAuth();
      router.replace("/admin/login");
      return;
    }
    setAuthed(true);
  }, [router]);

  if (!authed) {
    return null;
  }

  return null;
}
