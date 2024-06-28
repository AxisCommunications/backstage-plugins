import { useInfiniteQuery } from '@tanstack/react-query';
import { UserEntityV1alpha1 } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { slice } from 'lodash';
import { DateTime } from 'luxon';
import { vacationCalendarApiRef } from '../api';

const PAGE_SIZE = 20;

export const useAvailability = (
  users: UserEntityV1alpha1[] | undefined,
  startDate: DateTime<true>,
  endDate: DateTime<true>,
  isSignedIn: boolean,
) => {
  const calendarApi = useApi(vacationCalendarApiRef);
  const {
    data: availablity,
    error,
    isLoading: isAvailabilityLoading,
    isFetching: isAvailabilityFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryFn: ({ pageParam = 0 }) => {
      const currentUsers = slice(users || [], pageParam, pageParam + PAGE_SIZE);

      return calendarApi.getAvailability(
        {
          users: currentUsers?.map(u => u.spec.profile?.email ?? '') || [],
          startDateTime: startDate.toISO(),
          endDateTime: endDate.toISO(),
        },
        {
          Prefer: 'outlook.timezone="Europe/Stockholm"',
        },
      );
    },
    queryKey: [
      'calendarAvailability',
      users,
      startDate.toISO(),
      endDate.toISO(),
    ],
    getNextPageParam: (_, allPages) => {
      const numberOfUsers = allPages.flatMap(p => p).length;
      if (numberOfUsers === users?.length) {
        return undefined;
      }
      // This will be starting index to fetch the next batch.
      return numberOfUsers;
    },
    cacheTime: 30000 * 1000,
    enabled: isSignedIn && startDate.isValid && endDate.isValid && !!users,
    retry: false,
    refetchInterval: 30000 * 1000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return {
    availablity,
    error,
    isLoading: isAvailabilityLoading,
    isFetching: isAvailabilityFetching,
    hasNextPage,
    fetchNextPage,
  };
};
