import useAsync from 'react-use/lib/useAsync';
import { JiraResponse } from '@axis-backstage/plugin-jira-dashboard-common';
import { JiraDashboardApi } from '../api';

export function useJira(
  entityRef: string,
  projectKey: string,
  jiraDashboardApi: JiraDashboardApi,
): {
  data: JiraResponse | undefined;
  loading: boolean;
  error: Error | undefined;
} {
  const {
    value: data,
    loading,
    error,
  } = useAsync(async (): Promise<any> => {
    const response = await jiraDashboardApi.getJiraResponseByEntity(
      entityRef,
      projectKey,
    );
    response.project.avatarUrls = await jiraDashboardApi.getProjectAvatar(
      entityRef,
    );
    return response;
  });
  return { data, loading, error };
}
