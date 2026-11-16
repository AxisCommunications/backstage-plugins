import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import {
  AuthService,
  DiscoveryService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import {
  DEFAULT_NAMESPACE,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { NotFoundError } from '@backstage/errors';

/**
 * The options accepted by {@link createGetReadmeContentAction}.
 *
 * @public
 */
export interface GetReadmeContentActionOptions {
  /** The actions registry that the action is registered in. */
  actionsRegistry: ActionsRegistryService;
  /** The authentication service. */
  auth: AuthService;
  /** The discovery service, used to locate the readme backend. */
  discovery: DiscoveryService;
  /** The logger service. */
  logger: LoggerService;
}

/**
 * Registers an action in the Actions Registry that retrieves the README file
 * of a catalog entity, making it available to MCP clients such as AI
 * assistants.
 *
 * The action is read-only, and it fetches the content from the readme
 * backend plugin's HTTP API so that the plugin's configuration and cache are
 * shared with the READMEs displayed on entity pages.
 *
 * @public
 */
export function createGetReadmeContentAction(
  options: GetReadmeContentActionOptions,
) {
  const { actionsRegistry, auth, discovery, logger } = options;

  actionsRegistry.register({
    name: 'get-readme-content',
    title: 'Get README Content',
    description:
      'Retrieves the README file of a Backstage catalog entity. Use this to get ' +
      'documentation, setup instructions, or general information about a ' +
      'component, API, or other entity. Returns the raw content in its ' +
      'original format (markdown or plain text).',
    attributes: {
      readOnly: true,
      idempotent: true,
      destructive: false,
    },
    schema: {
      input: zod =>
        zod.object({
          entityRef: zod
            .string()
            .describe(
              'Entity reference on the format "kind:namespace/name", ' +
                'e.g. "component:default/my-service" or "api:default/user-api". ' +
                'Can also be just "namespace/name" for components.',
            ),
        }),
      output: zod =>
        zod.object({
          entityRef: zod.string().describe('The full entity reference'),
          content: zod.string().describe('The README file content'),
          contentType: zod
            .string()
            .describe(
              'MIME type of the content, e.g. "text/markdown" or "text/plain"',
            ),
        }),
    },
    examples: [
      {
        title: 'Get the README of a service',
        input: { entityRef: 'component:default/my-service' },
      },
    ],
    action: async ({ input, credentials }) => {
      const entityRef = parseEntityRef(input.entityRef, {
        defaultKind: 'Component',
        defaultNamespace: DEFAULT_NAMESPACE,
      });

      logger.debug(`Fetching README for ${stringifyEntityRef(entityRef)}`);

      const baseUrl = await discovery.getBaseUrl('readme');
      const { token } = await auth.getPluginRequestToken({
        onBehalfOf: credentials,
        targetPluginId: 'readme',
      });

      const response = await fetch(
        `${baseUrl}/${encodeURIComponent(
          entityRef.kind.toLowerCase(),
        )}/${encodeURIComponent(entityRef.namespace)}/${encodeURIComponent(
          entityRef.name,
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 404) {
        throw new NotFoundError(
          `No README found for entity ${stringifyEntityRef(entityRef)}`,
        );
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch README for ${stringifyEntityRef(entityRef)}, ` +
            `the readme backend responded with status ${response.status}`,
        );
      }

      const content = await response.text();
      const contentType = response.headers.get('content-type') ?? 'text/plain';

      return {
        output: {
          entityRef: stringifyEntityRef(entityRef),
          content,
          contentType: contentType.split(';')[0].trim(),
        },
      };
    },
  });
}
