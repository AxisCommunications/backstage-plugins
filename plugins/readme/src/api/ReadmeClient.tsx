import {
  ApiHolder,
  DiscoveryApi,
  FetchApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import {
  DEFAULT_NAMESPACE,
  Entity,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { NotFoundError, ResponseError } from '@backstage/errors';
import { ReadmeApi, readmeApiRef } from './ReadmeApi';

/**
 * Checks if a README is available for the given entity by making a request to the backend.
If the backend returns a 404 NotFound error, it indicates that no README is available for the entity.
@param entity - The entity for which to check the README availability.
@param context - The context providing access to the API holder.
@returns A promise that resolves to true if the README is available, or false if not found (404).
 *  @public
 */
export const isReadmeAvailable = async (
  entity: Entity,
  context: { apis: ApiHolder },
): Promise<boolean> => {
  const readmeClient = context.apis.get(readmeApiRef);

  if (readmeClient === undefined) {
    return false;
  }

  try {
    await readmeClient.getReadmeContent(stringifyEntityRef(entity));
  } catch (error) {
    if (error instanceof ResponseError && error.statusCode === 404) {
      return false;
    }
  }
  return true;
};

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
      throw await ResponseError.fromResponse(resp);
    }
    throw new Error(`${resp.status}: ${resp.statusText}`);
  }
}
