import { TimelineItemBase } from 'react-calendar-timeline';
import { UserEntity, UserEntityV1alpha1 } from '@backstage/catalog-model';
import { ScheduleInformation } from '@microsoft/microsoft-graph-types';
import { InfiniteData } from '@tanstack/react-query';
import dayjs from 'dayjs';

const isTimeLineItem = (
  item: TimelineItemBase<any> | undefined,
): item is TimelineItemBase<any> => {
  return item !== undefined;
};

const createUsersByEmail = (users: UserEntity[]) => {
  return users.reduce((usersByEmail, user) => {
    const email = user.spec.profile?.email;

    if (email) {
      usersByEmail.set(email.toLowerCase(), user);
    }

    return usersByEmail;
  }, new Map<string, UserEntity>());
};

const getUser = (usersByEmail: Map<string, UserEntity>, userId: string) => {
  return usersByEmail.get(userId.toLowerCase());
};

const getFullName = (usersByEmail: Map<string, UserEntity>, userId: string) => {
  const user = getUser(usersByEmail, userId);

  return user?.spec.profile?.displayName ?? userId;
};

export const getScheduleItems = (
  availability: InfiniteData<ScheduleInformation[], unknown> | undefined,
  groupIndexMap?: Map<number, number>,
) => {
  return availability
    ? availability.pages
        .flatMap(p => p)
        // @ts-ignore
        .flatMap((a, i) =>
          // @ts-ignore
          a.scheduleItems
            // @ts-ignore
            ?.filter(scheduleItem => scheduleItem.status === 'oof')
            // @ts-ignore
            .map(s => ({
              id: Date.now().toString(36) + Math.random().toString(36).slice(2),
              group: groupIndexMap?.get(i) ?? i,
              start_time: dayjs(s.start?.dateTime!),
              end_time: dayjs(s.end?.dateTime!),
              canMove: false,
              canResize: false,
            })),
        )
        .filter(isTimeLineItem)
    : [];
};

export const getGroups = (
  availability: InfiniteData<ScheduleInformation[], unknown> | undefined,
  currentUserEmail: string | false,
  users: UserEntityV1alpha1[] | undefined,
): [
  groups: Array<{
    id: number;
    highlight: boolean;
    title: string;
    entity?: UserEntity;
    height: number;
  }>,
  groupIndexMap: Map<number, number>,
] => {
  if (!availability) {
    return [[], new Map()];
  }

  const usersByEmail = createUsersByEmail(users || []);
  const flattenedSchedules = availability.pages
    .flatMap(p => p)
    .map((a, originalIndex) => ({
      originalIndex,
      schedule: a,
      title: getFullName(usersByEmail, a.scheduleId || ''),
    }));

  // Sort by title (display name) alphabetically
  const sortedSchedules = [...flattenedSchedules].sort((a, b) => {
    const titleA = a.title || '';
    const titleB = b.title || '';
    return titleA.localeCompare(titleB);
  });

  // Create mapping from original index to new sorted index
  const groupIndexMap = new Map(
    sortedSchedules.map((item, newIndex) => [item.originalIndex, newIndex]),
  );

  const groups = sortedSchedules.map((item, newIndex) => {
    const isHighlighted =
      currentUserEmail &&
      item.schedule.scheduleId?.toLowerCase() ===
        currentUserEmail.toLowerCase();

    return {
      id: newIndex,
      highlight: !!isHighlighted,
      title: item.title || '',
      entity: getUser(usersByEmail, item.schedule.scheduleId || ''),
      height: 30,
    };
  });

  return [groups, groupIndexMap];
};
