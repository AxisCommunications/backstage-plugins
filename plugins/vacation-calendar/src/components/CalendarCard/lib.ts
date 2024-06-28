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
              group: i,
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
) => {
  return availablity
    ? availablity.pages
        .flatMap(p => p)
        .map((a, i) => ({
          id: i,
          // @ts-ignore
          highlight:
            isUserEntity &&
            a.scheduleId &&
            isUserEntity === head(a.scheduleId.split('@')),
          title: getFullName(users || [], a.scheduleId || ''),
          entity: getUser(users || [], a.scheduleId || ''),
          height: 30,
        }))
    : [];
};
