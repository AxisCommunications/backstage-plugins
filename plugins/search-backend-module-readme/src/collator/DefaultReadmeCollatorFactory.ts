import {
  AuthService,
  DiscoveryService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import {
  CATALOG_FILTER_EXISTS,
  EntityFilterQuery,
  QueryEntitiesInitialRequest,
} from '@backstage/catalog-client';
import {
  Entity,
  getEntitySourceLocation,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { catalogEntityReadPermission } from '@backstage/plugin-catalog-common/alpha';
import { CatalogService } from '@backstage/plugin-catalog-node';
import { Permission } from '@backstage/plugin-permission-common';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import pLimit from 'p-limit';
import { Readable } from 'stream';
import {
  ReadmeCollatorFactoryOptions,
  readCollatorConfigOptions,
} from './config';
import { markdownToText } from './markdownToText';

/**
 * A search document for the README file of a catalog entity.
 *
 * @public
 */
export interface ReadmeDocument {
  /** The title of the document. */
  title: string;
  /** The searchable content of the README. */
  text: string;
  /** The URL that the search result links to. */
  location: string;
  /** The entity reference that the README belongs to. */
  entityRef: string;
  /** The kind of the entity. */
  kind: string;
  /** The namespace of the entity. */
  namespace: string;
  /** The name of the entity. */
  name: string;
}

/**
 * Collates the README files of catalog entities into documents for the search
 * backend.
 *
 * The README content is fetched from the readme backend plugin, so its
 * configuration and cache are shared with the READMEs that are displayed on
 * entity pages.
 *
 * @public
 */
export class DefaultReadmeCollatorFactory implements DocumentCollatorFactory {
  /** The type of documents produced by this factory. */
  public readonly type: string = 'readme';
  /** The permission that controls visibility of indexed documents. */
  public readonly visibilityPermission: Permission =
    catalogEntityReadPermission;

  private readonly auth: AuthService;
  private readonly catalog: CatalogService;
  private readonly discovery: DiscoveryService;
  private readonly logger: LoggerService;
  private readonly locationTemplate: string;
  private readonly parallelismLimit: number;
  private readonly filter: EntityFilterQuery | undefined;

  /**
   * Creates a collator factory from configuration.
   */
  static fromConfig(
    configRoot: Config,
    options: ReadmeCollatorFactoryOptions,
  ): DefaultReadmeCollatorFactory {
    const configOptions = readCollatorConfigOptions(configRoot);
    return new DefaultReadmeCollatorFactory({
      ...options,
      locationTemplate: configOptions.locationTemplate,
      parallelismLimit: configOptions.parallelismLimit,
      filter: configOptions.filter,
    });
  }

  private constructor(options: {
    auth: AuthService;
    catalog: CatalogService;
    discovery: DiscoveryService;
    logger: LoggerService;
    locationTemplate: string;
    parallelismLimit: number;
    filter: EntityFilterQuery | undefined;
  }) {
    this.auth = options.auth;
    this.catalog = options.catalog;
    this.discovery = options.discovery;
    this.logger = options.logger.child({ documentType: this.type });
    this.locationTemplate = options.locationTemplate;
    this.parallelismLimit = options.parallelismLimit;
    this.filter = options.filter;
  }

  /**
   * Returns a stream of documents to be indexed.
   */
  async getCollator(): Promise<Readable> {
    return Readable.from(this.execute());
  }

  private async *execute(): AsyncGenerator<ReadmeDocument, void, undefined> {
    const limit = pLimit(this.parallelismLimit);
    const readmeBaseUrl = await this.discovery.getBaseUrl('readme');

    const batchSize = this.parallelismLimit * 50;
    let cursor: string | undefined;
    const initialRequest: QueryEntitiesInitialRequest = {
      filter: {
        'metadata.annotations.backstage.io/source-location':
          CATALOG_FILTER_EXISTS,
        ...this.filter,
      },
      limit: batchSize,
      totalItems: 'exclude',
    };

    do {
      const credentials = await this.auth.getOwnServiceCredentials();
      const response = await this.catalog.queryEntities(
        cursor ? { cursor, limit: batchSize } : initialRequest,
        { credentials },
      );
      cursor = response.pageInfo.nextCursor;

      // Fetch a fresh plugin token for each page, since tokens are short
      // lived and a full collation run may take longer than their lifetime
      const { token } = await this.auth.getPluginRequestToken({
        onBehalfOf: credentials,
        targetPluginId: 'readme',
      });

      const docPromises = response.items.map((entity: Entity) =>
        limit(async (): Promise<ReadmeDocument[]> => {
          try {
            const doc = await this.fetchReadmeDocument(
              entity,
              readmeBaseUrl,
              token,
            );
            return doc ? [doc] : [];
          } catch (error) {
            this.logger.debug(
              `Failed to index README for ${stringifyEntityRef(
                entity,
              )}: ${error}`,
            );
            return [];
          }
        }),
      );
      yield* (await Promise.all(docPromises)).flat();
    } while (cursor);
  }

  private async fetchReadmeDocument(
    entity: Entity,
    readmeBaseUrl: string,
    token: string,
  ): Promise<ReadmeDocument | undefined> {
    let source;
    try {
      source = getEntitySourceLocation(entity);
    } catch {
      // Entities without a source location cannot have an indexed README
      return undefined;
    }
    if (source.type !== 'url') {
      return undefined;
    }

    const entityRef = stringifyEntityRef(entity);
    const namespace = entity.metadata.namespace || 'default';
    const response = await fetch(
      `${readmeBaseUrl}/${encodeURIComponent(entity.kind)}/${encodeURIComponent(
        namespace,
      )}/${encodeURIComponent(entity.metadata.name)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (response.status === 404) {
      this.logger.debug(`No README found for ${entityRef}`);
      return undefined;
    }

    if (!response.ok) {
      throw new Error(
        `Request failed for ${entityRef}, status ${response.status}`,
      );
    }

    const content = await response.text();
    const contentType = response.headers.get('content-type') ?? 'text/plain';
    const title = entity.metadata.title ?? entity.metadata.name;

    this.logger.debug(`Indexed README for ${entityRef}`);

    return {
      title: `${title} - README`,
      // Only markdown content is converted to plain text, plain text and
      // reStructuredText readmes are indexed as they are
      text: contentType.includes('text/markdown')
        ? markdownToText(content)
        : content,
      location: this.applyArgsToFormat(this.locationTemplate, {
        namespace: encodeURIComponent(entity.metadata.namespace || 'default'),
        kind: encodeURIComponent(entity.kind),
        name: encodeURIComponent(entity.metadata.name),
      }),
      entityRef,
      kind: entity.kind,
      namespace: entity.metadata.namespace || 'default',
      name: entity.metadata.name,
    };
  }

  private applyArgsToFormat(
    format: string,
    args: Record<string, string>,
  ): string {
    let formatted = format;

    for (const [key, value] of Object.entries(args)) {
      formatted = formatted.replace(`:${key}`, value);
    }

    return formatted.toLowerCase();
  }
}
