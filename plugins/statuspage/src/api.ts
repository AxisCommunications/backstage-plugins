import {
  createApiRef,
  DiscoveryApi,
  FetchApi,
} from '@backstage/core-plugin-api';
import type {
  Component,
  ComponentGroup,
} from '@axis-backstage/plugin-statuspage-common';

export interface StatuspageApi {
  getComponents(name: string): Promise<Component[]>;
  getComponentGroups(name: string): Promise<ComponentGroup[]>;
  getLink(name: string): Promise<{ url: string }>;
}

export const statuspageApiRef = createApiRef<StatuspageApi>({
  id: 'statuspage',
});

export class StatuspageClient implements StatuspageApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async getLink(name: string): Promise<{ url: string }> {
    const baseUrl = await this.discoveryApi.getBaseUrl('statuspage');
    const response = await this.fetchApi.fetch(
      `${baseUrl}/fetch-link/${encodeURIComponent(name)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    throw new Error(
      `Failed to get statuspage link for ${name} with status code ${response.status}`,
    );
  }

  async getComponents(name: string): Promise<Component[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('statuspage');
    const data = await this.fetchApi.fetch(
      `${baseUrl}/fetch-components/${encodeURIComponent(name)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (data.ok) return data.json();
    throw new Error(`Failed to get statuspage components for ${name}`);
  }

  async getComponentGroups(name: string): Promise<ComponentGroup[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('statuspage');
    const data = await this.fetchApi.fetch(
      `${baseUrl}/fetch-component-groups/${encodeURIComponent(name)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (data.ok) return data.json();
    throw new Error(`Failed to get statuspage component groups for ${name}`);
  }
}
