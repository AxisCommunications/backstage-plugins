import {
  DiscoveryApi,
  FetchApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import { DEFAULT_NAMESPACE, parseEntityRef } from '@backstage/catalog-model';
import { ReadmeApi } from './ReadmeApi';

export class ReadmeClient implements ReadmeApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;
  private readonly identityApi: IdentityApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
    this.identityApi = options.identityApi;
  }

  async getReadmeContent(entityRef: string): Promise<[string, string]> {
    const { token } = await this.identityApi.getCredentials();
    const baseUrl = await this.discoveryApi.getBaseUrl('readme');

    const { kind, name, namespace } = parseEntityRef(entityRef, {
      defaultNamespace: DEFAULT_NAMESPACE,
    });

    const resp = await this.fetchApi.fetch(
      `${baseUrl}/${kind}/${namespace}/${name}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (resp.ok) {
      return [
        await resp.text(),
        resp.headers.get('Content-Type') || 'text/plain',
      ];
    }
    if (resp.status === 404) {
      throw new Error('404');
    }
    throw new Error(`${resp.status}: ${resp.statusText}`);
  }
}
