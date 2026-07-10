import { useInfiniteQuery } from '@tanstack/react-query';
import { UserEntityV1alpha1 } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { type Dayjs } from 'dayjs';
import { vacationCalendarApiRef } from '../api';

const PAGE_SIZE = 20;
const GRAPH_DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

export const useAvailability = (
  users: UserEntityV1alpha1[] | undefined,
  startDate: Dayjs,
  endDate: Dayjs,
  isSignedIn: boolean,
) => {
  const calendarApi = useApi(vacationCalendarApiRef);
  const {
    data: availability,
    error,
    isLoading: isAvailabilityLoading,
    isFetching: isAvailabilityFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryFn: ({ pageParam }) => {
      const currentUsers = (users || []).slice(
        pageParam,
        pageParam + PAGE_SIZE,
      );

      return calendarApi.getAvailability(
        {
          users: currentUsers?.map(u => u.spec.profile?.email ?? '') || [],
          startDateTime: startDate.format(GRAPH_DATE_TIME_FORMAT),
          endDateTime: endDate.format(GRAPH_DATE_TIME_FORMAT),
        },
        {
          Prefer: 'outlook.timezone="Europe/Stockholm"',
        },
      );
    },
    queryKey: [
      'calendarAvailability',
      users,
      startDate.format(GRAPH_DATE_TIME_FORMAT),
      endDate.format(GRAPH_DATE_TIME_FORMAT),
    ],
    initialPageParam: 0,
    getNextPageParam: (_, allPages) => {
      const numberOfUsers = allPages.flatMap(p => p).length;
      if (numberOfUsers === users?.length) {
        return undefined;
      }
      // This will be starting index to fetch the next batch.
      return numberOfUsers;
    },
    gcTime: 30000 * 1000,
    enabled: isSignedIn && startDate.isValid() && endDate.isValid() && !!users,
    retry: false,
    refetchInterval: 30000 * 1000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return {
    availability,
    error,
    isLoading: isAvailabilityLoading,
    isFetching: isAvailabilityFetching,
    hasNextPage,
    fetchNextPage,
  };
};
