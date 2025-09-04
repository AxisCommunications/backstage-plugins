import { convertLegacyRouteRefs } from '@backstage/core-compat-api';
import { createFrontendPlugin } from '@backstage/frontend-plugin-api';
import { entityJiraContent, jiraApi } from './alpha/index';
import { rootRouteRef } from './routes';

/**
 * Frontend plugin that fetches and displays Jira issues for an entity
 *
 * @alpha
 * @packageDocumentation
 */
export default createFrontendPlugin({
  pluginId: 'jira-dashboard',
  extensions: [entityJiraContent, jiraApi],
  routes: convertLegacyRouteRefs({
    rootRouteRef,
  }),
});
