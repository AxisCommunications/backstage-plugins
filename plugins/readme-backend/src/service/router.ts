import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { CacheManager } from '@backstage/backend-defaults/cache';
import {
  AuthService,
  DiscoveryService,
  LoggerService,
  RootConfigService,
  UrlReaderService,
} from '@backstage/backend-plugin-api';
import { ScmIntegrations } from '@backstage/integration';
import {
  getEntitySourceLocation,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { CatalogClient } from '@backstage/catalog-client';
import { isError, NotFoundError } from '@backstage/errors';
import express from 'express';
import Router from 'express-promise-router';
import { isSymLink } from '../lib';
import { DEFAULT_TTL, NOT_FOUND_PLACEHOLDER, README_TYPES } from './constants';
import { ReadmeFile } from './types';

/**
 * Constructs a readme router.
 *
 */
interface RouterOptions {
  auth: AuthService;
  config: RootConfigService;
  discovery: DiscoveryService;
  logger: LoggerService;
  reader: UrlReaderService;
}

/**
 * Constructs a readme router.
 *
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { auth, logger, config, reader, discovery } = options;
  const catalogClient = new CatalogClient({ discoveryApi: discovery });

  const pluginCache = CacheManager.fromConfig(config).forPlugin('readme');
  const cache = pluginCache.getClient({ defaultTtl: DEFAULT_TTL });

  logger.info('Initializing readme backend');
  const integrations = ScmIntegrations.fromConfig(config);
  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    response.json({ status: 'ok' });
  });

  router.get('/:kind/:namespace/:name', async (request, response) => {
    const { kind, namespace, name } = request.params;
    const entityRef = stringifyEntityRef({ kind, namespace, name });
    const cacheDoc = (await cache.get(entityRef)) as ReadmeFile | undefined;

    if (cacheDoc && cacheDoc.name === NOT_FOUND_PLACEHOLDER) {
      throw new NotFoundError('Readme could not be found');
    }
    if (cacheDoc) {
      logger.info(`Loading README for ${entityRef} from cache.`);
      response.type(cacheDoc.type);
      response.send(cacheDoc.content);
      return;
    }
    const { token } = await auth.getPluginRequestToken({
      onBehalfOf: await auth.getOwnServiceCredentials(),
      targetPluginId: 'catalog',
    });
    const entity = await catalogClient.getEntityByRef(entityRef, { token });
    if (!entity) {
      logger.info(`No integration found for ${entityRef}`);
      response
        .status(500)
        .json({ error: `No integration found for ${entityRef}` });
      return;
    }
    const source = getEntitySourceLocation(entity);

    if (!source || source.type !== 'url') {
      const errorMessage = `Not valid location for ${source.target}`;
      logger.info(errorMessage);
      throw new NotFoundError(errorMessage);
    }
    const integration = integrations.byUrl(source.target);

    if (!integration) {
      logger.info(`No integration found for ${source.target}`);
      response
        .status(500)
        .json({ error: `No integration found for ${source.target}` });
      return;
    }

    for (const fileType of README_TYPES) {
      const url = integration.resolveUrl({
        url: fileType.name,
        base: source.target,
      });

      let content;

      try {
        logger.debug(`Trying README location: ${url} for ${entityRef} `);
        response.type(fileType.type);

        const urlResponse = await reader.readUrl(url);
        content = (await urlResponse.buffer()).toString('utf-8');

        if (isSymLink(content)) {
          const symLinkUrl = integration.resolveUrl({
            url: content,
            base: source.target,
          });
          const symLinkUrlResponse = await reader.readUrl(symLinkUrl);
          content = (await symLinkUrlResponse.buffer()).toString('utf-8');
        }

        cache.set(entityRef, {
          name: fileType.name,
          type: fileType.type,
          content: content,
        });
        logger.info(
          `Found README for ${entityRef}: ${url} type ${fileType.type}`,
        );
        response.send(content);
        return;
      } catch (error: unknown) {
        if (isError(error) && error.name === 'NotFoundError') {
          continue;
        } else {
          response.status(500).json({
            error: `Readme failure: ${error}`,
          });
          return;
        }
      }
    }
    logger.info(`Readme not found for ${entityRef}`);
    cache.set(entityRef, {
      name: NOT_FOUND_PLACEHOLDER,
      type: '',
      content: '',
    });
    throw new NotFoundError('Readme could not be found');
  });

  const middleware = MiddlewareFactory.create({ logger, config });
  router.use(middleware.error());
  return router;
}
