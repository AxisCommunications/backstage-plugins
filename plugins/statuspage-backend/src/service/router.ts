import { CacheManager, errorHandler } from '@backstage/backend-common';
import { LoggerService } from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
import { fetchComponentGroups, fetchComponents, getLink } from './api';
import { Config } from '@backstage/config';
import { getStatuspageConfig } from '../config';

/**
 * Router options.
 *
 * @deprecated Please migrate to the new backend system as this will be removed in the future.
 * @public
 */
export interface RouterOptions {
  /** The logger instance */
  logger: LoggerService;
  /** Backstage config object */
  config: Config;
}

const COMPONENT_GROUPS_KEY = 'component-groups';
const COMPONENTS_KEY = 'components';

/**
 * Create the router.
 *
 * @deprecated Please migrate to the new backend system as this will be removed in the future.
 * @public
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;
  logger.info('Setting up router for statuspage-backend');
  const pluginCache = CacheManager.fromConfig(config).forPlugin('statuspage');
  const statuspageConfig = getStatuspageConfig(config);
  const cache = pluginCache.getClient({ defaultTtl: 1000 * 60 * 2 });

  const router = Router();
  router.use(express.json());

  router.get('/fetch-components/:name', async (request, response) => {
    const name = request.params.name;
    let components = (await cache.get(`${COMPONENTS_KEY}-${name}`)) as any;
    if (!components) {
      components = await fetchComponents(name, statuspageConfig);
      await cache.set(`${COMPONENTS_KEY}-${name}`, components);
    }
    response.json(components);
  });

  router.get('/fetch-component-groups/:name', async (request, response) => {
    const name = request.params.name;
    let componentGroups = (await cache.get(
      `${COMPONENT_GROUPS_KEY}-${name}`,
    )) as any;
    if (!componentGroups) {
      componentGroups = await fetchComponentGroups(name, statuspageConfig);
      await cache.set(`${COMPONENT_GROUPS_KEY}-${name}`, componentGroups);
    }
    response.json(componentGroups);
  });

  router.get('/fetch-link/:name', (request, response) => {
    const name = request.params.name;
    response.json({ url: getLink(name, statuspageConfig) || '' });
  });

  router.use(errorHandler());
  return router;
}
