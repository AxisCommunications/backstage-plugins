import {
  CacheManager,
  TokenManager,
  createLegacyAuthAdapters,
  errorHandler,
} from '@backstage/backend-common';
import {
  AuthService,
  DiscoveryService,
  HttpAuthService,
} from '@backstage/backend-plugin-api';
import { UserEntity, stringifyEntityRef } from '@backstage/catalog-model';
import express from 'express';
import Router from 'express-promise-router';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { CatalogClient } from '@backstage/catalog-client';
import { IdentityApi } from '@backstage/plugin-auth-node';

import { getDefaultFiltersForUser } from '../filters';
import {
  type Filter,
  type JiraResponse,
  type Project,
} from '@axis-backstage/plugin-jira-dashboard-common';
import stream from 'stream';
import { getProjectAvatar } from '../api';
import {
  getProjectResponse,
  getFiltersFromAnnotations,
  getIssuesFromFilters,
  getIssuesFromComponents,
} from './service';
import { getAnnotations } from '../lib';

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
  discovery: DiscoveryService;

  /**
   * Backstage identity api instance
   */
  identity?: IdentityApi;

  /**
   * Backstage token manager instance
   */
  tokenManager?: TokenManager;
  /**
   * Backstage auth service
   */
  auth?: AuthService;
  /**
   * Backstage httpAuth service
   */
  httpAuth?: HttpAuthService;
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
  const { auth, httpAuth } = createLegacyAuthAdapters(options);
  const { logger, config, discovery } = options;
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
      const { token } = await auth.getPluginRequestToken({
        onBehalfOf: await auth.getOwnServiceCredentials(),
        targetPluginId: 'catalog',
      });
      const entity = await catalogClient.getEntityByRef(entityRef, { token });
      const {
        projectKeyAnnotation,
        componentsAnnotation,
        componentRoadieAnnotation,
        filtersAnnotation,
      } = getAnnotations(config);

      if (!entity) {
        logger.info(`No entity found for ${entityRef}`);
        response
          .status(500)
          .json({ error: `No entity found for ${entityRef}` });
        return;
      }

      const projectKey =
        entity.metadata.annotations?.[projectKeyAnnotation]?.split(',')!;

      if (!projectKey) {
        const error = `No jira.com/project-key annotation found for ${entityRef}`;
        logger.info(error);
        response.status(404).json(error);
        return;
      }

      let projectResponse;

      try {
        projectResponse = await getProjectResponse(
          projectKey[0],
          config,
          cache,
        );
      } catch (err: any) {
        logger.error(
          `Could not find Jira project ${projectKey[0]}: ${err.message}`,
        );
        response.status(404).json({
          error: `No Jira project found with key ${projectKey[0]}`,
        });
        return;
      }

      let userEntity: UserEntity | undefined;

      try {
        const credentials = await httpAuth.credentials(request, {
          allow: ['user'],
        });
        const userIdentity = credentials.principal.userEntityRef;

        userEntity = (await catalogClient.getEntityByRef(userIdentity, {
          token,
        })) as UserEntity;
      } catch (err) {
        console.warn('Could not find user identity');
      }

      let filters: Filter[] = [];

      const customFilterAnnotations =
        entity.metadata.annotations?.[filtersAnnotation]?.split(',')!;

      filters = getDefaultFiltersForUser(config, userEntity);

      if (customFilterAnnotations) {
        filters.push(
          ...(await getFiltersFromAnnotations(customFilterAnnotations, config)),
        );
      }

      let components =
        entity.metadata.annotations?.[componentsAnnotation]?.split(',') ?? [];
      let issues = await getIssuesFromFilters(
        projectKey[0],
        components,
        filters,
        config,
      );

      /*   Adding support for Roadie's component annotation */
      components = components.concat(
        entity.metadata.annotations?.[componentRoadieAnnotation]?.split(',') ??
          [],
      );

      if (components) {
        const componentIssues = await getIssuesFromComponents(
          projectKey[0],
          components,
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

  router.get(
    '/avatar/by-entity-ref/:kind/:namespace/:name',
    async (request, response) => {
      const { kind, namespace, name } = request.params;
      const entityRef = stringifyEntityRef({ kind, namespace, name });
      const { token } = await auth.getPluginRequestToken({
        onBehalfOf: await auth.getOwnServiceCredentials(),
        targetPluginId: 'catalog',
      });
      const entity = await catalogClient.getEntityByRef(entityRef, { token });
      const { projectKeyAnnotation } = getAnnotations(config);

      if (!entity) {
        logger.info(`No entity found for ${entityRef}`);
        response
          .status(500)
          .json({ error: `No entity found for ${entityRef}` });
        return;
      }

      const projectKey =
        entity.metadata.annotations?.[projectKeyAnnotation]?.split(',')!;

      const projectResponse = await getProjectResponse(
        projectKey[0],
        config,
        cache,
      );

      if (!projectResponse) {
        logger.error('Could not find project in Jira');
        response.status(400).json({
          error: `No Jira project found for project key ${projectKey[0]}`,
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
    },
  );
  router.use(errorHandler());
  return router;
}
