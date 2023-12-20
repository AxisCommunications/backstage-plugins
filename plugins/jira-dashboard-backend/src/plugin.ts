import { createRouter } from './service/router';
import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';

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
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        discovery: coreServices.discovery,
        identity: coreServices.identity,
        tokenManager: coreServices.tokenManager,
        httpRouter: coreServices.httpRouter,
      },
      async init({
        logger,
        config,
        discovery,
        identity,
        tokenManager,
        httpRouter,
      }) {
        httpRouter.use(
          await createRouter({
            logger: loggerToWinstonLogger(logger),
            config,
            discovery,
            identity,
            tokenManager,
          }),
        );
      },
    });
  },
});
