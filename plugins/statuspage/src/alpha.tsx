/**
 * Frontend plugin that allows visualization of component statuses from statuspage.io.
 *
 * @packageDocumentation
 */

import {
  ApiBlueprint,
  createFrontendPlugin,
  discoveryApiRef,
  fetchApiRef,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import { statuspageApiRef } from './api/StatuspageApi';
import { StatuspageClient } from './api/StatuspageClient';
import { EntityCardBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { rootRouteRef } from './routes';
import { z } from 'zod';

const statuspageApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: statuspageApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new StatuspageClient({ discoveryApi, fetchApi }),
    }),
});

const statuspagePage = PageBlueprint.makeWithOverrides({
  configSchema: {
    /**
     * The name of the statuspage instance as configured in `app-config.yaml`.
     *
     * @example
     * ```yaml
     * # app-config.yaml
     * app:
     *   extensions:
     *     - page:statuspage:
     *         config:
     *           name: mystatuspageinstance
     * ```
     */
    name: z.string().default(''),
  },
  factory(originalFactory, { config }) {
    return originalFactory({
      path: '/statuspage',
      routeRef: rootRouteRef,
      loader: async () =>
        import('./components/StatuspageComponent').then(m => (
          <m.StatuspageComponent name={config.name} />
        )),
    });
  },
});

const statuspageEntityCard = EntityCardBlueprint.make({
  params: {
    loader: async () =>
      import('./components/StatuspageEntityCard').then(m => (
        <m.StatuspageEntityCard />
      )),
  },
});

export default createFrontendPlugin({
  pluginId: 'statuspage',
  extensions: [statuspageApi, statuspagePage, statuspageEntityCard],
  routes: {
    root: rootRouteRef,
  },
});
