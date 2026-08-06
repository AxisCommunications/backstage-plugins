import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { configApiRef } from '@backstage/frontend-plugin-api';
import { isJiraDashboardAvailable } from '../availability';
import { rootRouteRef } from './routes';
/**
 * @alpha
 */
export const entityJiraContent = EntityContentBlueprint.makeWithOverrides({
  name: 'entity',
  factory: (originalFactory, { apis }) => {
    const annotationPrefix =
      apis
        .get(configApiRef)
        ?.getOptionalString('jiraDashboard.annotationPrefix') || 'jira.com';
    return originalFactory({
      path: '/jira',
      title: 'Jira Dashboard',
      filter: entity => isJiraDashboardAvailable(entity, annotationPrefix),
      routeRef: rootRouteRef,
      loader: async () =>
        import('../components/JiraDashboardContent').then(m => (
          <m.JiraDashboardContent />
        )),
    });
  },
});
