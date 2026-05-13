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
    /**
     * Sets the maximum height of the README card content area. Accepts any
     * valid CSS length value (e.g. `'235px'`, `'50vh'`) or `'none'` to show
     * the full content without scrolling.
     *
     * Defaults to `'235px'`.
     *
     * @example
     * ```yaml
     * # app-config.yaml
     * app:
     *   extensions:
     *     - entity-card:readme:
     *         config:
     *           maxHeight: 500px
     * ```
     */
    maxHeight: z.string().default('235px'),
  },
  factory(originalFactory, { config }) {
    return originalFactory({
      loader: async () =>
        import('./components/ReadmeCard').then(m => (
          <m.ReadmeCard
            hideIfNotFound={config.hideIfNotFound}
            maxHeight={config.maxHeight}
          />
        )),
    });
  },
});

export default createFrontendPlugin({
  pluginId: 'readme',
  extensions: [readmeApi, readmeCard],
});
