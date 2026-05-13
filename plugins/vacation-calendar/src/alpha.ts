import { createFrontendPlugin } from '@backstage/frontend-plugin-api';
import {
  entityVacationCalendarContent,
  vacationCalendarApi,
} from './alpha/index';
import { rootRouteRef } from './routes';

/**
 * Frontend plugin that fetches and displays out of office events for entities.
 *
 * @alpha
 * @packageDocumentation
 */
export default createFrontendPlugin({
  pluginId: 'vacation-calendar',
  extensions: [entityVacationCalendarContent, vacationCalendarApi],
  routes: {
    root: rootRouteRef,
  },
});
