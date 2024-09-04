import useAsync from 'react-use/lib/useAsync';
import { JiraDashboardApi } from '../api';
import { Issue } from '@axis-backstage/plugin-jira-dashboard-common';

export function useJiraUserIssues(
  maxResults: number,
  jiraDashboardApi: JiraDashboardApi,
): {
  data: Issue[] | undefined;
  loading: boolean;
  error: Error | undefined;
} {
  const {
    value: data,
    loading,
    error,
  } = useAsync(async () => {
    return jiraDashboardApi.getLoggedInUserIssues(maxResults);
  }, [jiraDashboardApi]);
  return { data, loading, error };
}
