import useAsync from 'react-use/lib/useAsync';
import { JiraResponse } from '@axis-backstage/plugin-jira-dashboard-common';
import { JiraDashboardApi } from '../api';

/**
 * Hook to get the Jira data for a given entity.
 * @param entityRef - The entity reference to get Jira data for
 * @param jiraDashboardApi - The Jira dashboard API
 * @public
 */
export function useJira(
  entityRef: string,
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
    const response = await jiraDashboardApi.getJiraResponseByEntity(entityRef);
    const project = Array.isArray(response.project)
      ? response.project
      : [response.project];
    return {
      project,
      data: response.data || [],
    };
  });
  return { data, loading, error };
}
