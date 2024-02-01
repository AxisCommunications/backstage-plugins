import { createApiRef } from '@backstage/core-plugin-api';
import { JiraResponse } from '@axis-backstage/plugin-jira-dashboard-common';

export const jiraDashboardApiRef = createApiRef<JiraDashboardApi>({
  id: 'plugin.jira-dashboard',
});

export type JiraDashboardApi = {
  getJiraResponseByEntity(entityRef: string): Promise<JiraResponse>;
  getProjectAvatar(entityRef: string): any;
};
