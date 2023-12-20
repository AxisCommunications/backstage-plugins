import { JiraDashboardClient, jiraDashboardApiRef } from './api';
import { rootRouteRef } from './routes';
import { PROJECT_KEY_ANNOTATION } from '@axis-backstage/plugin-jira-dashboard-common';
import { Entity } from '@backstage/catalog-model';
import {
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  createApiFactory,
  fetchApiRef,
} from '@backstage/core-plugin-api';

/**
 * Checks if the entity has a jira.com project-key annotation.
 * @public
 * @param entity - The entity to check for the jira.com project-key annotation.
 */
export const isJiraDashboardAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[PROJECT_KEY_ANNOTATION]);

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
