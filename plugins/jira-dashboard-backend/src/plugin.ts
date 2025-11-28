import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';
import { createRouter } from './service/router';
import { JiraConfig } from './config';
import { createGetJiraTicketInfoAction } from './actions/createGetJiraTicketInfoAction';

/**
 * The Jira Dashboard backend plugin.
 *
 * @public
 */
export const jiraDashboardPlugin = createBackendPlugin({
  pluginId: 'jira-dashboard',
  register(env) {
    env.registerInit({
      deps: {
        actionsRegistry: actionsRegistryServiceRef,
        auth: coreServices.auth,
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        rootConfig: coreServices.rootConfig,
        discovery: coreServices.discovery,
        httpAuth: coreServices.httpAuth,
        userInfo: coreServices.userInfo,
        cache: coreServices.cache,
      },
      async init({
        actionsRegistry,
        auth,
        httpRouter,
        logger,
        rootConfig,
        discovery,
        httpAuth,
        userInfo,
        cache,
      }) {
        httpRouter.use(
          await createRouter({
            auth,
            logger,
            rootConfig,
            config: JiraConfig.fromConfig(rootConfig),
            discovery,
            httpAuth,
            userInfo,
            cache,
          }),
        );
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
        createGetJiraTicketInfoAction({
          actionsRegistry,
          rootConfig,
          logger,
        });
      },
    });
  },
});
