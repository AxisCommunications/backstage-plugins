import { TimelineItemBase } from 'react-calendar-timeline';
import { UserEntity, UserEntityV1alpha1 } from '@backstage/catalog-model';
import { ScheduleInformation } from '@microsoft/microsoft-graph-types';
import { InfiniteData } from '@tanstack/react-query';
import { head } from 'lodash';
import { DateTime } from 'luxon';

const isTimeLineItem = (
  item: TimelineItemBase<any> | undefined,
): item is TimelineItemBase<any> => {
  return item !== undefined;
};

const getFullName = (users: UserEntity[], userId: string) => {
  const name = head(userId.split('@'));
  const user = users.find(u => u.metadata.name === name);

  if (user) return user.spec.profile?.displayName;
  return userId;
};

const getUser = (users: UserEntity[], userId: string) => {
  const name = head(userId.split('@'));
  const user = users.find(u => u.metadata.name === name);

  return user;
};

export const getScheduleItems = (
  availablity: InfiniteData<ScheduleInformation[]> | undefined,
  groupIndexMap?: Map<number, number>,
) => {
  return availablity
    ? availablity?.pages
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
              start_time: DateTime.fromISO(s.start?.dateTime!),
              end_time: DateTime.fromISO(s.end?.dateTime!),
              canMove: false,
              canResize: false,
            })),
        )
        .filter(isTimeLineItem)
    : [];
};

export const getGroups = (
  availablity: InfiniteData<ScheduleInformation[]> | undefined,
  isUserEntity: string | false,
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
  if (!availablity) {
    return [[], new Map()];
  }

  const flattenedSchedules = availablity.pages
    .flatMap(p => p)
    .map((a, originalIndex) => ({
      originalIndex,
      schedule: a,
      title: getFullName(users || [], a.scheduleId || ''),
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
      isUserEntity &&
      item.schedule.scheduleId &&
      isUserEntity === head(item.schedule.scheduleId.split('@'));

    return {
      id: newIndex,
      highlight: !!isHighlighted,
      title: item.title || '',
      entity: getUser(users || [], item.schedule.scheduleId || ''),
      height: 30,
    };
  });

  return [groups, groupIndexMap];
};
