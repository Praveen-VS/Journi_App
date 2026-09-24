'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { ReactNode, useState, Suspense } from 'react';
import RouteProgressBar from '@/components/shared/RouteProgressBar';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  // Ensure the query client is instantiated once per component lifecycle
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <RouteProgressBar />
      </Suspense>
      {children}
    </QueryClientProvider>
  );
}
