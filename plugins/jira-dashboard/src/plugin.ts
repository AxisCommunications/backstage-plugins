import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';
import { Entity } from '@backstage/catalog-model';
import { PROJECT_KEY_NAME } from '@axis-backstage/plugin-jira-dashboard-common';
import { jiraDashboardApiRef, JiraDashboardClient } from './api';

/**
 * Checks if the entity has a jira.com project-key annotation.
 * @public
 * @param entity - The entity to check for the jira.com project-key annotation.
 */
export const isJiraDashboardAvailable = (
  entity: Entity,
  annotationPrefix?: string,
) =>
  Boolean(
    entity.metadata.annotations?.[
      `${annotationPrefix ?? 'jira.com'}/${PROJECT_KEY_NAME}`
    ],
  );

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
