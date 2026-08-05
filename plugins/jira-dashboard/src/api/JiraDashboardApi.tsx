import { createApiRef, type ApiRef } from '@backstage/frontend-plugin-api';
import {
  Issue,
  JiraResponse,
} from '@axis-backstage/plugin-jira-dashboard-common';

/**
 * The apiref for the Jira dashboard plugin.
 *
 * @public
 */
export const jiraDashboardApiRef: ApiRef<JiraDashboardApi> =
  createApiRef<JiraDashboardApi>().with({
    id: 'plugin.jira-dashboard',
    pluginId: 'jira-dashboard',
  });

/**
 * The Jira dashboard API.
 * @public
 */
export type JiraDashboardApi = {
  getJiraResponseByEntity(entityRef: string): Promise<JiraResponse>;
  getLoggedInUserIssues(
    maxResults: number,
    filterName: string,
  ): Promise<Issue[]>;
  getProjectAvatar(entityRef: string): any;
};
