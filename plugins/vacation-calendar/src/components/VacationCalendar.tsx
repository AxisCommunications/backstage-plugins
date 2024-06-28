import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CalendarCard } from './CalendarCard';

const queryClient = new QueryClient();

export const VacationCalendar = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CalendarCard />
    </QueryClientProvider>
  );
};
