import { createLegacyAuthAdapters } from '@backstage/backend-common';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { CacheManager } from '@backstage/backend-defaults/cache';
import {
  AuthService,
  DiscoveryService,
  HttpAuthService,
  LoggerService,
  IdentityService,
  RootConfigService,
  TokenManagerService,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { stringifyEntityRef, UserEntity } from '@backstage/catalog-model';
import express from 'express';
import Router from 'express-promise-router';
import { CatalogClient } from '@backstage/catalog-client';

import { getAssigneUser, getDefaultFiltersForUser } from '../filters';
import {
  type Filter,
  type JiraResponse,
  type Project,
} from '@axis-backstage/plugin-jira-dashboard-common';
import stream from 'stream';
import { getProjectAvatar } from '../api';
import {
  getFiltersFromAnnotations,
  getIssuesFromComponents,
  getIssuesFromFilters,
  getProjectResponse,
  getUserIssues,
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
  logger: LoggerService;

  /**
   * Backstage config object
   */
  config: RootConfigService;

  /**
   * Backstage discovery api instance
   */
  discovery: DiscoveryService;

  /**
   * Backstage identity api instance
   */
  identity?: IdentityService;

  /**
   * Backstage token manager instance
   */
  tokenManager?: TokenManagerService;
  /**
   * Backstage auth service
   */
  auth?: AuthService;
  /**
   * Backstage httpAuth service
   */
  httpAuth?: HttpAuthService;

  /**
   * Backstage userInfo service
   */
  userInfo: UserInfoService;
}

const DEFAULT_TTL = 1000 * 60;

const DEFAULT_MAX_RESULTS_USER_ISSUES = 10;

/**
 * Constructs a jira dashboard router.
 *
 * @public
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { auth, httpAuth } = createLegacyAuthAdapters(options);
  const { logger, config, discovery, userInfo } = options;
  const catalogClient = new CatalogClient({ discoveryApi: discovery });

  const pluginCache =
    CacheManager.fromConfig(config).forPlugin('jira-dashboard');
  const cache = pluginCache.getClient({ defaultTtl: DEFAULT_TTL });
  logger.info('Initializing Jira Dashboard backend');

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
        filtersAnnotation,
        incomingIssuesAnnotation,
        componentRoadieAnnotation,
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
        logger.warn('Could not find user identity');
      }

      let filters: Filter[] = [];

      const incomingStatus =
        entity.metadata.annotations?.[incomingIssuesAnnotation];

      filters = getDefaultFiltersForUser(config, userEntity, incomingStatus);

      const customFilterAnnotations =
        entity.metadata.annotations?.[filtersAnnotation]?.split(',')!;

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

  router.get('/dashboards/user-issues', async (request, response) => {
    const { token } = await auth.getPluginRequestToken({
      onBehalfOf: await auth.getOwnServiceCredentials(),
      targetPluginId: 'catalog',
    });

    const credentials = await httpAuth.credentials(request, {
      allow: ['user'],
    });

    // we ignore guest and service users, no issues in response
    if (!auth.isPrincipal(credentials, 'user')) {
      response.status(200).json([]);
      return;
    }

    const info = await userInfo.getUserInfo(credentials);

    const userEntity = (await catalogClient.getEntityByRef(info.userEntityRef, {
      token,
    })) as UserEntity;

    if (!userEntity) {
      const error = `User entity cannot be determined from ${info.userEntityRef}`;
      logger.info(error);
      response.status(400).json(error);
      return;
    }

    const username = getAssigneUser(config, userEntity);

    const maxResults = Number(
      request.query.maxResults || DEFAULT_MAX_RESULTS_USER_ISSUES,
    );

    try {
      const issues = await getUserIssues(username, maxResults, config, cache);
      response.status(200).json(issues);
    } catch (err: any) {
      logger.error(`Error during getting user issues: ${err.message}`);
      response.status(503).json({
        error: `Error during getting user issues: ${err.message}`,
      });
      return;
    }
  });

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
          logger.error(`${err}`);
          response.sendStatus(400);
        }
        return;
      });
      ps.pipe(response);
    },
  );
  const middleware = MiddlewareFactory.create({ logger, config });
  router.use(middleware.error());
  return router;
}
