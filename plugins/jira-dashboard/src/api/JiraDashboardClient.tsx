import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { JiraResponse } from '@axis-backstage/plugin-jira-dashboard-common';
import { JiraDashboardApi } from './JiraDashboardApi';
import { ResponseError } from '@backstage/errors';

export class JiraDashboardClient implements JiraDashboardApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async getJiraResponseByEntity(entityRef: string): Promise<JiraResponse> {
    const apiUrl = await this.discoveryApi.getBaseUrl('jira-dashboard');
    const resp = await this.fetchApi.fetch(
      `${apiUrl}/dashboards/by-entity-ref/${encodeURIComponent(entityRef)}`,
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

  async getProjectAvatar(entityRef: string): Promise<string> {
    const apiUrl = await this.discoveryApi.getBaseUrl('jira-dashboard');
    return `${apiUrl}/avatar/by-entity-ref/${encodeURIComponent(entityRef)}`;
  }
}
