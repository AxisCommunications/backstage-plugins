/**
 * Frontend plugin that fetches and displays the readme for an entity
 *
 * @packageDocumentation
 */

import {
  ApiBlueprint,
  createFrontendPlugin,
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
} from '@backstage/frontend-plugin-api';
import { readmeApiRef } from './api/ReadmeApi';
import { ReadmeClient } from './api/ReadmeClient';
import { EntityCardBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { z } from 'zod';

const readmeApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: readmeApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
        identityApi: identityApiRef,
      },
      factory: ({ discoveryApi, fetchApi, identityApi }) =>
        new ReadmeClient({ discoveryApi, fetchApi, identityApi }),
    }),
});

const readmeCard = EntityCardBlueprint.makeWithOverrides({
  configSchema: {
    /**
     * When set to `true`, the entire README card is hidden if no README file
     * is found for the entity (i.e. the backend returns a 404).
     *
     * Defaults to `false`, which shows an informational message with a link
     * to the documentation instead.
     *
     * @example
     * ```yaml
     * # app-config.yaml
     * app:
     *   extensions:
     *     - entity-card:readme:
     *         config:
     *           hideIfNotFound: true
     * ```
     */
    hideIfNotFound: z.boolean().default(false),
  },
  factory(originalFactory, { config }) {
    return originalFactory({
      loader: async () =>
        import('./components/ReadmeCard').then(m => (
          <m.ReadmeCard hideIfNotFound={config.hideIfNotFound} />
        )),
    });
  },
});

export default createFrontendPlugin({
  pluginId: 'readme',
  extensions: [readmeApi, readmeCard],
});
