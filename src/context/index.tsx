import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TicketProvider } from './TicketContext';

const ContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchInterval: false,
        gcTime: 60 * 1000
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TicketProvider>{children}</TicketProvider>
    </QueryClientProvider>
  );
};

export default ContextProvider;
