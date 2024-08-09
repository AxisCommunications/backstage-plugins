import {
  createApiExtension,
  createApiFactory,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/frontend-plugin-api';
import { jiraDashboardApiRef, JiraDashboardClient } from '../api';

/**
 * @alpha
 */
export const jiraApi = createApiExtension({
  factory: createApiFactory({
    api: jiraDashboardApiRef,
    deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
    factory: ({ discoveryApi, fetchApi }) =>
      new JiraDashboardClient({ discoveryApi, fetchApi }),
  }),
});
