'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { viewEventRegs, deleteTeamByEvent } from '@/services/admin';
import { getAdminToken } from '@/lib/auth';
import type { EventRegEntry } from '@/services/admin';

export function useViewEventRegs() {
  const queryClient = useQueryClient();
  const [eventName, setEventName] = useState('');
  const [enabled, setEnabled] = useState(false);

  const query = useQuery<EventRegEntry[], Error>({
    queryKey: ['admin', 'viewEventRegs', eventName],
    queryFn: () => {
      const token = getAdminToken();
      if (!token) throw new Error('No admin token');
      return viewEventRegs(eventName, token);
    },
    enabled,
    staleTime: 30000,
    retry: 1,
  });

  const search = useCallback((name: string) => {
    setEventName(name);
    setEnabled(true);
  }, []);

  const deleteByEventMutation = useMutation({
    mutationFn: ({ leaderId, event }: { leaderId: string; event: string }) => {
      const token = getAdminToken();
      if (!token) throw new Error('No admin token');
      return deleteTeamByEvent(leaderId, event, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'viewEventRegs'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboardStats'] });
    },
  });

  return {
    data: query.data,
    eventName,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    search,
    deleteByEvent: deleteByEventMutation.mutateAsync,
    isDeleting: deleteByEventMutation.isPending,
  };
}
