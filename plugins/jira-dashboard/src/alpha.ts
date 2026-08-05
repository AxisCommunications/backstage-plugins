import { createFrontendPlugin } from '@backstage/frontend-plugin-api';
import {
  entityJiraContent,
  jiraApi,
  jiraUserIssuesWidget,
} from './alpha/index';
import { rootRouteRef } from './alpha/routes';

/**
 * Frontend plugin that fetches and displays Jira issues for an entity
 *
 * @alpha
 * @packageDocumentation
 */
export default createFrontendPlugin({
  pluginId: 'jira-dashboard',
  extensions: [entityJiraContent, jiraApi, jiraUserIssuesWidget],
  routes: {
    rootRouteRef,
  },
});
