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
import type { FrontendPlugin } from '@backstage/frontend-plugin-api';

const plugin: FrontendPlugin = createFrontendPlugin({
  id: 'jira-dashboard',
  extensions: [entityJiraContent, jiraApi],
  routes: convertLegacyRouteRefs({
    rootRouteRef,
  }),
});

export default plugin;
