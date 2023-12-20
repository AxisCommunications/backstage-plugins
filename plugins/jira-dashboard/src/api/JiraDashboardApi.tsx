import { JiraResponse } from '@axis-backstage/plugin-jira-dashboard-common';
import { createApiRef } from '@backstage/core-plugin-api';

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
