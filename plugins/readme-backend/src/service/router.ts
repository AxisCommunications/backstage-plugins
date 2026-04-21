import {
  AuthService,
  CacheService,
  LoggerService,
  RootConfigService,
  UrlReaderService,
} from '@backstage/backend-plugin-api';
import { CatalogService } from '@backstage/plugin-catalog-node';
import { ScmIntegrations } from '@backstage/integration';
import {
  getEntitySourceLocation,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { isError, NotFoundError } from '@backstage/errors';
import express from 'express';
import Router from 'express-promise-router';
import { isSymLink } from '../lib';
import { getCacheTtl } from './config';
import { NOT_FOUND_PLACEHOLDER, getReadmeTypes } from './constants';
import { ReadmeFile } from './types';

/**
 * Constructs a readme router.
 *
 */
interface RouterOptions {
  auth: AuthService;
  catalogApi: CatalogService;
  config: RootConfigService;
  logger: LoggerService;
  reader: UrlReaderService;
  cache: CacheService;
}

/**
 * Constructs a readme router.
 *
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { auth, logger, config, reader, catalogApi, cache } = options;
  const cacheTtl = getCacheTtl(config);
  const readmeTypes = getReadmeTypes(config);

  logger.info(`Initializing readme backend. Cache TTL: ${cacheTtl}ms`);
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
    const entity = await catalogApi.getEntityByRef(entityRef, {
      credentials: await auth.getOwnServiceCredentials(),
    });
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

    for (const fileType of readmeTypes) {
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

        await cache.set(
          entityRef,
          {
            name: fileType.name,
            type: fileType.type,
            content: content,
          },
          { ttl: cacheTtl },
        );
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
    await cache.set(
      entityRef,
      {
        name: NOT_FOUND_PLACEHOLDER,
        type: '',
        content: '',
      },
      { ttl: cacheTtl },
    );
    throw new NotFoundError('Readme could not be found');
  });

  return router;
}
