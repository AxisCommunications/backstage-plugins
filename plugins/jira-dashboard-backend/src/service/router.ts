import express from 'express';
import Router from 'express-promise-router';
import stream from 'stream';

import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { CacheManager } from '@backstage/backend-defaults/cache';
import {
  AuthService,
  DiscoveryService,
  HttpAuthService,
  LoggerService,
  RootConfigService,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { stringifyEntityRef, UserEntity } from '@backstage/catalog-model';
import { CatalogClient } from '@backstage/catalog-client';

import {
  type Filter,
  type JiraResponse,
  type Project,
} from '@axis-backstage/plugin-jira-dashboard-common';

import { getAnnotations } from '../lib';
import {
  getFiltersFromAnnotations,
  getIssuesFromComponents,
  getIssuesFromFilters,
  getProjectResponse,
  getUserIssues,
} from './service';
import { DEFAULT_MAX_RESULTS_USER_ISSUES, DEFAULT_TTL } from './defaultValues';
import { getAssigneUser, getDefaultFiltersForUser } from '../filters';
import { getProjectAvatar } from '../api';
import type { ConfigInstance, JiraConfig } from '../config';

export interface RouterOptions {
  /**
   * Implementation of Authentication Service
   */
  auth: AuthService;
  /**
   * Implementation of Logger Service
   */
  logger: LoggerService;
  /**
   * Implementation of Config Service
   */
  rootConfig: RootConfigService;
  /**
   * Parsed Jira config
   */
  config: JiraConfig;
  /**
   * Implementation of Discovery Service
   */
  discovery: DiscoveryService;
  /**
   * Implementation of Http Authentication Service
   */
  httpAuth: HttpAuthService;
  /**
   * Implementation of User Info Service
   */
  userInfo: UserInfoService;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { auth, logger, rootConfig, config, discovery, httpAuth, userInfo } =
    options;
  const catalogClient = new CatalogClient({ discoveryApi: discovery });

  const pluginCache =
    CacheManager.fromConfig(rootConfig).forPlugin('jira-dashboard');
  const cache = pluginCache.getClient({ defaultTtl: DEFAULT_TTL });
  logger.info('Initializing Jira Dashboard backend');

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
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
        instanceAnnotation,
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

      const instance = config.getInstance(
        entity.metadata.annotations?.[instanceAnnotation],
      );

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
          instance,
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

      filters = getDefaultFiltersForUser(instance, userEntity, incomingStatus);

      const customFilterAnnotations =
        entity.metadata.annotations?.[filtersAnnotation]?.split(',')!;

      if (customFilterAnnotations) {
        filters.push(
          ...(await getFiltersFromAnnotations(
            customFilterAnnotations,
            instance,
          )),
        );
      }

      let components =
        entity.metadata.annotations?.[componentsAnnotation]?.split(',') ?? [];
      let issues = await getIssuesFromFilters(
        projectKey[0],
        components,
        filters,
        instance,
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
          instance,
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

    const getUserIssuesForInstance = async (instance: ConfigInstance) => {
      const username = getAssigneUser(instance, userEntity);

      const maxResults = Number(
        request.query.maxResults || DEFAULT_MAX_RESULTS_USER_ISSUES,
      );

      try {
        const issues = await getUserIssues(
          username,
          maxResults,
          instance,
          cache,
        );
        return { issues, error: undefined };
      } catch (error: any) {
        return { error };
      }
    };

    const issuesList = await Promise.all(
      config
        .getInstances()
        .map(instanceName =>
          getUserIssuesForInstance(config.getInstance(instanceName)),
        ),
    );

    const issues = issuesList.flatMap(list => list.issues ?? []);
    const errors = issuesList
      .flatMap(list => list.error)
      .filter((v): v is NonNullable<typeof v> => !!v);

    if (issues.length > 0 || errors.length === 0) {
      response.status(200).json(issues);
    } else {
      const messages =
        errors.length > 1
          ? `\n  ${errors.map(err => err.message).join('\n  ')}`
          : ` ${errors[0].message}`;

      logger.error(`Error during getting user issues:${messages}`);
      response.status(503).json({
        error: `Error during getting user issues:${messages}`,
      });
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
      const { instanceAnnotation, projectKeyAnnotation } =
        getAnnotations(config);

      if (!entity) {
        logger.info(`No entity found for ${entityRef}`);
        response
          .status(500)
          .json({ error: `No entity found for ${entityRef}` });
        return;
      }

      const instance = config.getInstance(
        entity.metadata.annotations?.[instanceAnnotation],
      );

      const projectKey =
        entity.metadata.annotations?.[projectKeyAnnotation]?.split(',')!;

      const projectResponse = await getProjectResponse(
        projectKey[0],
        instance,
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

      const avatar = await getProjectAvatar(url, instance);

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

  const middleware = MiddlewareFactory.create({ logger, config: rootConfig });

  router.use(middleware.error());
  return router;
}
