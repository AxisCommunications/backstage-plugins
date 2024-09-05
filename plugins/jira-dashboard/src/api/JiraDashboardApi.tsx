import { createApiRef } from '@backstage/core-plugin-api';
import {
  Issue,
  JiraResponse,
} from '@axis-backstage/plugin-jira-dashboard-common';

export const jiraDashboardApiRef = createApiRef<JiraDashboardApi>({
  id: 'plugin.jira-dashboard',
});

/**
 * The Jira dashboard API.
 * @public
 */
export type JiraDashboardApi = {
  getJiraResponseByEntity(entityRef: string): Promise<JiraResponse>;
  getLoggedInUserIssues(maxResults: number): Promise<Issue[]>;
  getProjectAvatar(entityRef: string): any;
};
