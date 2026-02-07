import {
  AuthService,
  CacheService,
  DiscoveryService,
  LoggerService,
  RootConfigService,
  UrlReaderService,
} from '@backstage/backend-plugin-api';
import { CatalogClient } from '@backstage/catalog-client';
import {
  getEntitySourceLocation,
  stringifyEntityRef,
  Entity,
} from '@backstage/catalog-model';
import { isError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { Readable } from 'stream';
import { isSymLink } from '../lib';
import { getCacheTtl } from '../service/config';
import { getReadmeTypes } from '../service/constants';

/**
 * Extended index document for README files with additional metadata
 */
export interface ReadmeDocument {
  title: string;
  text: string;
  location: string;
  entityRef: string;
  kind: string;
  namespace: string;
  name: string;
}

/**
 * Options for creating a README collator
 */
export interface ReadmeCollatorFactoryOptions {
  auth: AuthService;
  cache: CacheService;
  config: RootConfigService;
  discovery: DiscoveryService;
  logger: LoggerService;
  reader: UrlReaderService;
}

/**
 * Search collator for README files from catalog entities
 */
export class ReadmeCollatorFactory implements DocumentCollatorFactory {
  public readonly type: string = 'readme';
  private readonly auth: AuthService;
  private readonly cache: CacheService;
  private readonly config: RootConfigService;
  private readonly discovery: DiscoveryService;
  private readonly logger: LoggerService;
  private readonly reader: UrlReaderService;

  private constructor(options: ReadmeCollatorFactoryOptions) {
    this.auth = options.auth;
    this.cache = options.cache;
    this.config = options.config;
    this.discovery = options.discovery;
    this.logger = options.logger;
    this.reader = options.reader;
  }

  static fromConfig(options: ReadmeCollatorFactoryOptions) {
    return new ReadmeCollatorFactory(options);
  }

  async getCollator() {
    return Readable.from(this.execute());
  }

  private async *execute(): AsyncGenerator<ReadmeDocument> {
    const catalogClient = new CatalogClient({
      discoveryApi: this.discovery,
    });
    const integrations = ScmIntegrations.fromConfig(this.config);
    const cacheTtl = getCacheTtl(this.config);
    const readmeTypes = getReadmeTypes(this.config);

    // Get service credentials for catalog access
    const { token } = await this.auth.getPluginRequestToken({
      onBehalfOf: await this.auth.getOwnServiceCredentials(),
      targetPluginId: 'catalog',
    });

    // Fetch all entities from catalog
    const { items: entities } = await catalogClient.getEntities(
      {},
      { token },
    );

    this.logger.info(
      `README Collator: Processing ${entities.length} entities`,
    );

    // Process each entity
    for (const entity of entities) {
      try {
        const readmeDoc = await this.processEntity(
          entity,
          integrations,
          readmeTypes,
          cacheTtl,
        );
        if (readmeDoc) {
          yield readmeDoc;
        }
      } catch (error) {
        const entityRef = stringifyEntityRef(entity);
        this.logger.debug(
          `Failed to index README for ${entityRef}: ${error}`,
        );
      }
    }

    this.logger.info('README Collator: Finished processing entities');
  }

  private async processEntity(
    entity: Entity,
    integrations: ScmIntegrations,
    readmeTypes: Array<{ name: string; type: string }>,
    cacheTtl: number,
  ): Promise<ReadmeDocument | null> {
    const entityRef = stringifyEntityRef(entity);
    const source = getEntitySourceLocation(entity);

    if (!source || source.type !== 'url') {
      return null;
    }

    const integration = integrations.byUrl(source.target);
    if (!integration) {
      return null;
    }

    // Try to find and read README file
    for (const fileType of readmeTypes) {
      try {
        const url = integration.resolveUrl({
          url: fileType.name,
          base: source.target,
        });

        const urlResponse = await this.reader.readUrl(url);
        let content = (await urlResponse.buffer()).toString('utf-8');

        // Handle symlinks
        if (isSymLink(content)) {
          const symLinkUrl = integration.resolveUrl({
            url: content,
            base: source.target,
          });
          const symLinkUrlResponse = await this.reader.readUrl(symLinkUrl);
          content = (await symLinkUrlResponse.buffer()).toString('utf-8');
        }

        // Cache the content
        this.cache.set(
          entityRef,
          {
            name: fileType.name,
            type: fileType.type,
            content: content,
          },
          { ttl: cacheTtl },
        );

        // Create search document
        const title = entity.metadata.title || entity.metadata.name;
        const location = `/catalog/${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;

        this.logger.debug(`Indexed README for ${entityRef}`);

        return {
          title: `${title} - README`,
          text: this.stripMarkdown(content),
          location,
          entityRef,
          kind: entity.kind,
          namespace: entity.metadata.namespace || 'default',
          name: entity.metadata.name,
        };
      } catch (error: unknown) {
        if (isError(error) && error.name === 'NotFoundError') {
          continue;
        }
        throw error;
      }
    }

    return null;
  }

  /**
   * Strip markdown formatting for better search indexing
   */
  private stripMarkdown(content: string): string {
    return (
      content
        // Remove code blocks
        .replace(/```[\s\S]*?```/g, '')
        // Remove inline code
        .replace(/`([^`]+)`/g, '$1')
        // Remove links but keep text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // Remove images
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
        // Remove headers
        .replace(/^#+\s+/gm, '')
        // Remove bold/italic
        .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
        // Remove horizontal rules
        .replace(/^[-*_]{3,}$/gm, '')
        // Normalize whitespace
        .replace(/\s+/g, ' ')
        .trim()
    );
  }
}
