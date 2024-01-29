import { createPlugin } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

/**
 * Plugin that provides the Analytics Module Umami api
 * @public */
export const analyticsModuleUmamiPlugin = createPlugin({
  id: 'analytics-module-umami',
  routes: {
    root: rootRouteRef,
  },
});
