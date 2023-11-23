import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { readmeApiRef } from './api/ReadmeApi';
import { ReadmeClient } from './api/ReadmeClient';

/**
 * Plugin that provides the Readme api
 * @public */
export const readmePlugin = createPlugin({
  id: 'readme',
  apis: [
    createApiFactory({
      api: readmeApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
        identityApi: identityApiRef,
      },
      factory: ({ discoveryApi, fetchApi, identityApi }) =>
        new ReadmeClient({ discoveryApi, fetchApi, identityApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

/**
 * Readme card exported from the Readme plugin
 * @public */
export const ReadmeCard = readmePlugin.provide(
  createRoutableExtension({
    name: 'ReadmeCard',
    component: () => import('./components/ReadmeCard').then(m => m.ReadmeCard),
    mountPoint: rootRouteRef,
  }),
);
