import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';
import { jiraDashboardApiRef, JiraDashboardClient } from './api';
export { isJiraDashboardAvailable } from './availability';

/**
 * Plugin that provides the Jira Dashboard api
 * @public */
export const jiraDashboardPlugin = createPlugin({
  id: 'jira-dashboard',
  apis: [
    createApiFactory({
      api: jiraDashboardApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new JiraDashboardClient({ discoveryApi, fetchApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

/**
 * Jira content exported from the Jira Dashboard plugin
 * @public */
export const JiraUserIssuesViewCard = jiraDashboardPlugin.provide(
  createComponentExtension({
    name: 'JiraUserIssuesViewCard',
    component: {
      lazy: () =>
        import('./components/JiraUserIssuesCard').then(
          m => m.JiraUserIssuesCard,
        ),
    },
  }),
);

/**
 * Jira content exported from the Jira Dashboard plugin
 * @public */
export const JiraUserIssuesTable = jiraDashboardPlugin.provide(
  createComponentExtension({
    name: 'JiraUserIssuesTable',
    component: {
      lazy: () =>
        import('./components/JiraUserIssuesTable').then(
          m => m.JiraUserIssuesTable,
        ),
    },
  }),
);

/**
 * Jira content exported from the Jira Dashboard plugin
 * @public */
export const EntityJiraDashboardContent = jiraDashboardPlugin.provide(
  createRoutableExtension({
    name: 'EntityJiraDashboardContent',
    component: () =>
      import('./components/JiraDashboardContent').then(
        m => m.JiraDashboardContent,
      ),
    mountPoint: rootRouteRef,
  }),
);
