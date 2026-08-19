'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/services/admin';
import { getAdminToken } from '@/lib/auth';
import type { DashboardStats } from '@/lib/types';

export function useDashboardStats() {
  return useQuery<DashboardStats, Error>({
    queryKey: ['admin', 'dashboardStats'],
    queryFn: () => {
      const token = getAdminToken();
      if (!token) throw new Error('No admin token');
      return getDashboardStats(token);
    },
    staleTime: 30000,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!getAdminToken(),
  });
}