import { CacheManager, errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { fetchComponentGroups, fetchComponents, getLink } from './api';
import { Config } from '@backstage/config';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

const COMPONENT_GROUPS_KEY = 'component-groups';
const COMPONENTS_KEY = 'components';

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;
  logger.debug('Setting up router for statuspage-backend');

  const pluginCache = CacheManager.fromConfig(config).forPlugin('statuspage');
  const cache = pluginCache.getClient({ defaultTtl: 1000 * 60 * 5 });

  const router = Router();
  router.use(express.json());

  router.get('/fetch-components/:name', async (request, response) => {
    const name = request.params.name;
    let components = (await cache.get(COMPONENTS_KEY)) as any;
    if (!components) {
      components = await fetchComponents(name, config);
      await cache.set(COMPONENTS_KEY, components);
    }
    response.json(components);
  });

  router.get('/fetch-component-groups/:name', async (request, response) => {
    const name = request.params.name;
    let componentGroups = (await cache.get(COMPONENT_GROUPS_KEY)) as any;
    if (!componentGroups) {
      componentGroups = await fetchComponentGroups(name, config);
      await cache.set(COMPONENT_GROUPS_KEY, componentGroups);
    }
    response.json(componentGroups);
  });

  router.get('/fetch-link/:name', (request, response) => {
    const name = request.params.name;
    response.json({ url: getLink(name, config) || '' });
  });

  router.use(errorHandler());
  return router;
}
