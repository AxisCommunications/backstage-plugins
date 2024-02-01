import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { StatuspageClient, statuspageApiRef } from './api';
import { STATUSPAGE_ANNOTATION } from '@axis-backstage/plugin-statuspage-common';
import { Entity } from '@backstage/catalog-model';

export const isStatuspageAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[STATUSPAGE_ANNOTATION]);

export const statuspagePlugin = createPlugin({
  id: 'statuspage',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: statuspageApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new StatuspageClient({ discoveryApi, fetchApi }),
    }),
  ],
});

export const StatuspagePage = statuspagePlugin.provide(
  createRoutableExtension({
    name: 'StatuspagePage',
    component: () => import('./components').then(m => m.StatuspageComponent),
    mountPoint: rootRouteRef,
  }),
);
