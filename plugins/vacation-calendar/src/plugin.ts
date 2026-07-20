import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  fetchApiRef,
  microsoftAuthApiRef,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';
import { VacationCalendarApiClient, vacationCalendarApiRef } from './api';

/**
 * Plugin that provides the VacationCalendar api
 * @public */
export const vacationCalendarPlugin = createPlugin({
  id: 'vacation-calendar',
  apis: [
    createApiFactory({
      api: vacationCalendarApiRef,
      deps: {
        authApi: microsoftAuthApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ authApi, fetchApi }) =>
        new VacationCalendarApiClient({ authApi, fetchApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

/**
 * Routable extension for VacationCalendarPage
 * @public
 */
export const VacationCalendarPage = vacationCalendarPlugin.provide(
  createRoutableExtension({
    name: 'VacationCalendarPage',
    component: () => import('./components').then(m => m.VacationCalendar),
    mountPoint: rootRouteRef,
  }),
);
