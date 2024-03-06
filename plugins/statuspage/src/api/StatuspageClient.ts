import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { StatuspageApi } from './StatuspageApi';
import {
  Component,
  ComponentGroup,
} from '@axis-backstage/plugin-statuspage-common';

/**
 * The client implementation for the frontend api.
 *
 * @public
 */
export class StatuspageClient implements StatuspageApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  /**
   * Fetches link for a statuspage
   *
   * @param name - name of the statuspage instance (from config)
   * @returns the url
   */
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

  /**
   * Returns the components for a statuspage instance
   *
   * @param name - the name of statuspage instance (from config)
   * @returns the components
   */
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

  /**
   * Returns the component groups for a statuspage instance
   *
   * @param name - the name of the statuspage instance (from config)
   * @returns the component groups
   */
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
