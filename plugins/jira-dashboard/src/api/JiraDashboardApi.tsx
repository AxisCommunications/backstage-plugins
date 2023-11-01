import { createApiRef } from '@backstage/core-plugin-api';
import { JiraResponse } from '@internal/plugin-jira-dashboard-common';

export const jiraDashboardApiRef = createApiRef<JiraDashboardApi>({
  id: 'plugin.jira-dashboard',
});

export type JiraDashboardApi = {
  getJiraResponseByEntity(
    entityRef: string,
    projectKey: string,
  ): Promise<JiraResponse>;
  getProjectAvatar(entityRef: string): any;
};
