'use client';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useState, ReactNode } from 'react';

import { ApiError } from '@/lib/api-client';
import { clearAllAuth } from '@/lib/auth';

function handleAuthError(error: unknown) {
  if (error instanceof ApiError && error.status === 401) {
    clearAllAuth();
    window.location.assign('/admin/login');
  }
}

export function AdminProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    queryCache: new QueryCache({ onError: handleAuthError }),
    mutationCache: new MutationCache({ onError: handleAuthError }),
    defaultOptions: {
      queries: {
        staleTime: 30000,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status === 401) return false;
          return failureCount < 1;
        },
        refetchOnWindowFocus: false,
        gcTime: 60000
      }
    }
  }));

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
