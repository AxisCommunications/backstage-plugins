import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import {
  Issue,
  JiraResponse,
} from '@axis-backstage/plugin-jira-dashboard-common';
import { JiraDashboardApi } from './JiraDashboardApi';
import { ResponseError } from '@backstage/errors';
import { DEFAULT_NAMESPACE, parseEntityRef } from '@backstage/catalog-model';

/**
 * Client for fetching data from the Jira Dashboard backend.
 *
 * @public
 */
export class JiraDashboardClient implements JiraDashboardApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  /**
   * Get Jira data for an entity.
   */
  async getJiraResponseByEntity(entityRef: string): Promise<JiraResponse> {
    const apiUrl = await this.discoveryApi.getBaseUrl('jira-dashboard');
    const { kind, name, namespace } = parseEntityRef(entityRef, {
      defaultNamespace: DEFAULT_NAMESPACE,
    });
    const resp = await this.fetchApi.fetch(
      `${apiUrl}/dashboards/by-entity-ref/${kind}/${namespace}/${name}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!resp.ok) throw await ResponseError.fromResponse(resp);
    return resp.json();
  }

  /**
   * Get the Jira project avatar URL for an entity.
   */
  async getProjectAvatar(entityRef: string): Promise<string> {
    const apiUrl = await this.discoveryApi.getBaseUrl('jira-dashboard');
    const { kind, name, namespace } = parseEntityRef(entityRef, {
      defaultNamespace: DEFAULT_NAMESPACE,
    });
    return `${apiUrl}/avatar/by-entity-ref/${kind}/${namespace}/${name}`;
  }

  /**
   * Get the Jira issues for the calling user.
   */
  async getLoggedInUserIssues(
    maxResults: number,
    filterName: string,
  ): Promise<Issue[]> {
    const apiUrl = await this.discoveryApi.getBaseUrl('jira-dashboard');

    // Convert to query parameters
    const searchParams = new URLSearchParams({
      maxResults: maxResults.toString(),
      filterName: filterName,
    });

    const resp = await this.fetchApi.fetch(
      `${apiUrl}/dashboards/user-issues?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!resp.ok) throw await ResponseError.fromResponse(resp);
    return resp.json();
  }
}
