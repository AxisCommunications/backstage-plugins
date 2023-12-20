import { getProjectAvatar } from '../api';
import { getDefaultFilters } from '../filters';
import {
  getProjectResponse,
  getFiltersFromAnnotations,
  getIssuesFromFilters,
  getIssuesFromComponents,
} from './service';
import {
  COMPONENT_ANNOTATION,
  FILTER_ANNOTATION,
  type Filter,
  type JiraResponse,
  PROJECT_KEY_ANNOTATION,
  type Project,
} from '@axis-backstage/plugin-jira-dashboard-common';
import {
  CacheManager,
  TokenManager,
  errorHandler,
} from '@backstage/backend-common';
import { CatalogClient } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { DiscoveryApi } from '@backstage/plugin-permission-common';
import express from 'express';
import Router from 'express-promise-router';
import stream from 'stream';
import { Logger } from 'winston';

/**
 * Constructs a jira dashboard router.
 * @public
 */
export interface RouterOptions {
  /**
   * Implementation of Winston logger
   */
  logger: Logger;

  /**
   * Backstage config object
   */
  config: Config;

  /**
   * Backstage discovery api instance
   */
  discovery: DiscoveryApi;

  /**
   * Backstage identity api instance
   */
  identity: IdentityApi;

  /**
   * Backstage token manager instance
   */
  tokenManager: TokenManager;
}

const DEFAULT_TTL = 1000 * 60;

/**
 * Constructs a jira dashboard router.
 *
 * @public
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config, discovery, identity, tokenManager } = options;
  const catalogClient = new CatalogClient({ discoveryApi: discovery });
  logger.info('Initializing Jira Dashboard backend');

  const pluginCache =
    CacheManager.fromConfig(config).forPlugin('jira-dashboard');
  const cache = pluginCache.getClient({ defaultTtl: DEFAULT_TTL });

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    response.json({ status: 'ok' });
  });

  router.get(
    '/dashboards/by-entity-ref/:entityRef',
    async (request, response) => {
      const entityRef = request.params.entityRef;
      const { token } = await tokenManager.getToken();
      const entity = await catalogClient.getEntityByRef(entityRef, { token });

      if (!entity) {
        logger.info(`No entity found for ${entityRef}`);
        response
          .status(500)
          .json({ error: `No entity found for ${entityRef}` });
        return;
      }

      const projectKey = entity.metadata.annotations?.[PROJECT_KEY_ANNOTATION]!;

      if (!projectKey) {
        const error = `No jira.com/project-key annotation found for ${entityRef}`;
        logger.info(error);
        response.status(404).json(error);
        return;
      }

      let projectResponse;

      try {
        projectResponse = await getProjectResponse(projectKey, config, cache);
      } catch (err) {
        logger.error(`Could not find Jira project ${projectKey}`);
        response.status(404).json({
          error: `No Jira project found with key ${projectKey}`,
        });
        return;
      }

      const userIdentity = await identity.getIdentity({ request: request });

      if (!userIdentity) {
        logger.warn(`Could not find user identity`);
      }

      let filters: Filter[] = [];

      const customFilterAnnotations =
        entity.metadata.annotations?.[FILTER_ANNOTATION]?.split(',')!;

      filters = getDefaultFilters(
        config,
        userIdentity?.identity?.userEntityRef,
      );

      if (customFilterAnnotations) {
        filters.push(
          ...(await getFiltersFromAnnotations(customFilterAnnotations, config)),
        );
      }

      let issues = await getIssuesFromFilters(projectKey, filters, config);

      const componentAnnotations =
        entity.metadata.annotations?.[COMPONENT_ANNOTATION]?.split(',')!;

      if (componentAnnotations) {
        const componentIssues = await getIssuesFromComponents(
          projectKey,
          componentAnnotations,
          config,
        );
        issues = issues.concat(componentIssues);
      }

      const jiraResponse: JiraResponse = {
        project: projectResponse as Project,
        data: issues,
      };
      response.json(jiraResponse);
    },
  );

  router.get('/avatar/by-entity-ref/:entityRef', async (request, response) => {
    const { entityRef } = request.params;
    const { token } = await tokenManager.getToken();
    const entity = await catalogClient.getEntityByRef(entityRef, { token });

    if (!entity) {
      logger.info(`No entity found for ${entityRef}`);
      response.status(500).json({ error: `No entity found for ${entityRef}` });
      return;
    }

    const projectKey = entity.metadata.annotations?.[PROJECT_KEY_ANNOTATION]!;

    const projectResponse = await getProjectResponse(projectKey, config, cache);

    if (!projectResponse) {
      logger.error('Could not find project in Jira');
      response.status(400).json({
        error: `No Jira project found for project key ${projectKey}`,
      });
      return;
    }

    const url = projectResponse.avatarUrls['48x48'];

    const avatar = await getProjectAvatar(url, config);

    const ps = new stream.PassThrough();
    const val = avatar.headers.get('content-type');

    response.setHeader('content-type', val ?? '');
    stream.pipeline(avatar.body, ps, err => {
      if (err) {
        logger.error(err);
        response.sendStatus(400);
      }
      return;
    });
    ps.pipe(response);
  });
  router.use(errorHandler());
  return router;
}
