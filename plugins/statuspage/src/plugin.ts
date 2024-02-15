import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { STATUSPAGE_ANNOTATION } from '@axis-backstage/plugin-statuspage-common';
import { Entity } from '@backstage/catalog-model';

import { rootRouteRef } from './routes';
import { statuspageApiRef } from './api/StatuspageApi';
import { StatuspageClient } from './api/StatuspageClient';

/**
 * Checks availability of a statuspage component
 *
 * @public
 */
export const isStatuspageAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[STATUSPAGE_ANNOTATION]);

/**
 * Create the plugin.
 *
 * @public
 */
export const statuspagePlugin = createPlugin({
  id: 'statuspage',
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
  routes: {
    root: rootRouteRef,
  },
});

/**
 * Routable extension for StatuspageComponent.
 *
 * @public
 */
export const StatuspagePage = statuspagePlugin.provide(
  createRoutableExtension({
    name: 'StatuspagePage',
    component: () =>
      import('./components/StatuspageComponent').then(
        m => m.StatuspageComponent,
      ),
    mountPoint: rootRouteRef,
  }),
);
