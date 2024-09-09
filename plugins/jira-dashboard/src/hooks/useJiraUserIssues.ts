import useAsync from 'react-use/lib/useAsync';
import { JiraDashboardApi } from '../api';
import { Issue } from '@axis-backstage/plugin-jira-dashboard-common';

/**
 * Hook to get the issues of the logged in user.
 * @param maxResults - The maximum number of issues to return
 * @param jiraDashboardApi - The Jira dashboard API
 * @public
 */
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
