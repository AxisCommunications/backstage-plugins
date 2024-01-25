import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const analyticsModuleUmamiPlugin = createPlugin({
  id: 'analytics-module-umami',
  routes: {
    root: rootRouteRef,
  },
});

export const AnalyticsModuleUmamiPage = analyticsModuleUmamiPlugin.provide(
  createRoutableExtension({
    name: 'AnalyticsModuleUmamiPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
