import {
  CacheService,
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
import { fetchComponentGroups, fetchComponents, getLink } from './api';
import { getStatuspageConfig } from '../config';

export interface RouterOptions {
  cache: CacheService;
  logger: LoggerService;
  rootConfig: RootConfigService;
}

const COMPONENT_GROUPS_KEY = 'component-groups';
const COMPONENTS_KEY = 'components';
const CACHE_TTL = 1000 * 60 * 2;

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { cache, logger, rootConfig } = options;
  logger.info('Setting up router for statuspage-backend');
  const statuspageConfig = getStatuspageConfig(rootConfig);

  const router = Router();
  router.use(express.json());

  router.get('/fetch-components/:name', async (request, response) => {
    const name = request.params.name;
    let components = (await cache.get(`${COMPONENTS_KEY}-${name}`)) as any;
    if (!components) {
      components = await fetchComponents(name, statuspageConfig);
      await cache.set(`${COMPONENTS_KEY}-${name}`, components, {
        ttl: CACHE_TTL,
      });
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
      await cache.set(`${COMPONENT_GROUPS_KEY}-${name}`, componentGroups, {
        ttl: CACHE_TTL,
      });
    }
    response.json(componentGroups);
  });

  router.get('/fetch-link/:name', (request, response) => {
    const name = request.params.name;
    response.json({ url: getLink(name, statuspageConfig) || '' });
  });

  return router;
}
