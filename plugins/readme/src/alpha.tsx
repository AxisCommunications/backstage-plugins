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

const readmeCard = EntityCardBlueprint.make({
  params: {
    loader: async () =>
      import('./components/ReadmeCard').then(m => <m.ReadmeCard />),
  },
});

export default createFrontendPlugin({
  pluginId: 'readme',
  extensions: [readmeApi, readmeCard],
});
