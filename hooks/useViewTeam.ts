'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { viewTeam, deleteTeam } from '@/services/admin';
import { getAdminToken } from '@/lib/auth';
import type { Department } from '@/lib/constants';
import type { RegisteredStudent, ViewTeamFilter } from '@/lib/types';

export function useViewTeam() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<ViewTeamFilter>({ college: '', department: '' });
  const [enabled, setEnabled] = useState(false);

  const query = useQuery<RegisteredStudent[], Error>({
    queryKey: ['admin', 'viewTeam', filter.college, filter.department],
    queryFn: () => {
      const token = getAdminToken();
      if (!token) throw new Error('No admin token');
      return viewTeam(filter, token);
    },
    enabled,
    staleTime: 30000,
    retry: 1,
  });

  const search = useCallback((college: string, department: Department | "") => {
    setFilter({ college, department });
    setEnabled(true);
  }, []);

  const deleteMutation = useMutation({
    mutationFn: (leaderId: string) => {
      const token = getAdminToken();
      if (!token) throw new Error('No admin token');
      return deleteTeam(leaderId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'viewTeam'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboardStats'] });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    search,
    deleteTeam: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
