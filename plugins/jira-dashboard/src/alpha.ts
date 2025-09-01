import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { entityJiraContent, jiraApi } from './alpha/index';

/**
 * Frontend plugin that fetches and displays Jira issues for an entity
 *
 * @alpha
 * @packageDocumentation
 */
export default createFrontendModule({
  pluginId: 'jira-dashboard',
  extensions: [entityJiraContent, jiraApi],
});
