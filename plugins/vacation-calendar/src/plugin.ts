import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const vacationCalendarPlugin = createPlugin({
  id: 'vacation-calendar',
  routes: {
    root: rootRouteRef,
  },
});

export const VacationCalendarPage = vacationCalendarPlugin.provide(
  createRoutableExtension({
    name: 'VacationCalendarPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
