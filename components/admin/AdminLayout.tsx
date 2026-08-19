'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminTabs } from './AdminTabs';
import { getAdminToken, clearAllAuth, requireSuperAdmin } from '@/lib/auth';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!requireSuperAdmin(router)) {
      router.push('/admin/login');
      return;
    }
    setHydrated(true);
  }, [router]);

  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-aion-bg font-rajdhani">
      {/* Subtle background pattern */}
      <div className="aion-bg-pattern" aria-hidden="true" />

      {/* Header with logo + logout */}
      <header className="bg-aion-card border-b border-aion sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div>
            <h1 className="font-orbitron text-xl font-bold text-aion-primary">Super Admin Dashboard</h1>
            <p className="text-xs text-aion-muted">AION 2K26</p>
          </div>
          <button
            onClick={() => { clearAllAuth(); router.push('/admin/login'); }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-aion-muted hover:bg-aion-border rounded-lg transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminTabs />
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}