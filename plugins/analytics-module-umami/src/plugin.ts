import { createPlugin } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const analyticsModuleUmamiPlugin = createPlugin({
  id: 'analytics-module-umami',
  routes: {
    root: rootRouteRef,
  },
});
