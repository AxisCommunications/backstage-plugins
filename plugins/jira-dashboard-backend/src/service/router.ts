import {
  CacheManager,
  TokenManager,
  errorHandler,
} from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { CatalogClient } from '@backstage/catalog-client';
import { DiscoveryApi } from '@backstage/plugin-permission-common';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { getDefaultFilters } from '../filters';
import {
  type Filter,
  type JiraResponse,
  type Project,
} from '@axis-backstage/plugin-jira-dashboard-common';
import stream from 'stream';
import { getIssuesByFilter, getProjectAvatar } from '../api';
import {
  getFiltersFromAnnotations,
  getIssuesFromComponents,
  getIssuesFromFilters,
  getProjectResponse,
} from './service';
import {
  PROJECT_KEY_ANNOTATION,
  FILTER_ANNOTATION,
  COMPONENT_ANNOTATION,
} from '../annotations';
import { stringifyEntityRef } from '@backstage/catalog-model';

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
    '/dashboards/by-entity-ref/:kind/:namespace/:name',
    async (request, response) => {
      const { kind, namespace, name } = request.params;
      const entityRef = stringifyEntityRef({ kind, namespace, name });
      const { token } = await tokenManager.getToken();
      const entity = await catalogClient.getEntityByRef(entityRef, { token });

      if (!entity) {
        logger.info(`No entity found for ${entityRef}`);
        response
          .status(500)
          .json({ error: `No entity found for ${entityRef}` });
        return;
      }

      const projectKeys =
        entity.metadata.annotations?.[PROJECT_KEY_ANNOTATION]?.split(',')!;

      if (!projectKeys) {
        const error = `No jira.com/project-keys annotation found for ${entityRef}`;
        logger.info(error);
        response.status(404).json(error);
        return;
      }

      let projectResponse;

      try {
        projectResponse = await getProjectResponse(
          projectKeys[0],
          config,
          cache,
        );
      } catch (err) {
        logger.error(`Could not find Jira project ${projectKeys[0]}`);
        response.status(404).json({
          error: `No Jira project found with key ${projectKeys[0]}`,
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
      const componentAnnotations =
        entity.metadata.annotations?.[COMPONENT_ANNOTATION]?.split(',')!;

      filters = getDefaultFilters(
        config,
        userIdentity?.identity?.userEntityRef,
      );

      if (customFilterAnnotations) {
        filters.push(
          ...(await getFiltersFromAnnotations(customFilterAnnotations, config)),
        );
      }

      let queryPrefix = `project in (${projectKeys}) AND `;
      if (componentAnnotations) {
        queryPrefix += `component in ('${componentAnnotations.join(
          "','",
        )}') AND `;
      }
      let issues = await getIssuesFromFilters(
        filters,
        queryPrefix,
        config,
        logger,
      );

      if (componentAnnotations) {
        queryPrefix = `project in (${projectKeys}) AND resolution = Unresolved AND component = `;
        const componentIssues = await getIssuesFromComponents(
          queryPrefix,
          componentAnnotations,
          config,
          logger,
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

  router.get(
    '/avatar/by-entity-ref/:kind/:namespace/:name',
    async (request, response) => {
      const { kind, namespace, name } = request.params;
      const entityRef = stringifyEntityRef({ kind, namespace, name });
      const { token } = await tokenManager.getToken();
      const entity = await catalogClient.getEntityByRef(entityRef, { token });

      if (!entity) {
        logger.info(`No entity found for ${entityRef}`);
        response
          .status(500)
          .json({ error: `No entity found for ${entityRef}` });
        return;
      }

      const projectKeys =
        entity.metadata.annotations?.[PROJECT_KEY_ANNOTATION]?.split(',')!;

      const projectResponse = await getProjectResponse(
        projectKeys[0],
        config,
        cache,
      );

      if (!projectResponse) {
        logger.error('Could not find project in Jira');
        response.status(400).json({
          error: `No Jira project found for project key ${projectKeys[0]}`,
        });
        return;
      }

      const url = projectResponse.avatarUrls['48x48'];

      const avatar = (await getProjectAvatar(url, config)) as any;

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
    },
  );

  router.get('/jira/search', async (request, response) => {
    const jqlQuery = request.query.jql as string;
    const fields = (request.query.fields as string) || '';
    const startAt = (request.query.startAt as string) || '0';
    const maxResults = (request.query.maxResults as string) || '50';

    // if 'jql' parameter is missing or empty return a 400 Bad Request status code
    if (!jqlQuery || jqlQuery.trim() === '') {
      return response.status(400).json({
        results: {
          errorMessages: [
            'Bad Request: The jql query parameter is missing in the request. ' +
              'Please include the jql parameter to perform the search.',
          ],
        },
      });
    }

    try {
      const results = await getIssuesByFilter(
        `${jqlQuery}&fields=${fields}&startAt=${startAt}&maxResults=${maxResults}`,
        config,
        logger,
      );
      // return a 400 status code if the jira response contains error messages
      if (results.errorMessages) {
        return response.status(400).json({
          results: results,
        });
      }

      return response.status(200).json({
        results: results,
      });
    } catch (err) {
      logger.error(
        `Encountered error performing Jira search for jql query: ${jqlQuery}`,
      );

      return response.status(500).json({
        results: {
          errorMessages: [`Encountered error processing request: ${err}`],
        },
      });
    }
  });

  router.use(errorHandler());
  return router;
}
