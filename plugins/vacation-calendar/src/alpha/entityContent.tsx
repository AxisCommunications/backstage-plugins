import { isGroupEntity, isUserEntity } from '@backstage/catalog-model';
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { rootRouteRef } from '../routes';

/**
 * @alpha
 */
export const entityVacationCalendarContent = EntityContentBlueprint.make({
  name: 'entity',
  params: {
    path: '/vacation-calendar',
    title: 'Out Of Office',
    routeRef: rootRouteRef,
    filter: entity => isGroupEntity(entity) || isUserEntity(entity),
    loader: async () =>
      import('../components').then(m => <m.VacationCalendar />),
  },
});
