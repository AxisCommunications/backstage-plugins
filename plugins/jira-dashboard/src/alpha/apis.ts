import {
  ApiBlueprint,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/frontend-plugin-api';
import { jiraDashboardApiRef, JiraDashboardClient } from '../api';

/**
 * @alpha
 */
export const jiraApi = ApiBlueprint.make({
  name: 'api',
  params: defineParams =>
    defineParams({
      api: jiraDashboardApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new JiraDashboardClient({ discoveryApi, fetchApi }),
    }),
});
