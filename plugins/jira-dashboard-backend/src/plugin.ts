import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';

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
        auth: coreServices.auth,
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        discovery: coreServices.discovery,
        httpAuth: coreServices.httpAuth,
        userInfo: coreServices.userInfo,
      },
      async init({
        auth,
        httpRouter,
        logger,
        config,
        discovery,
        httpAuth,
        userInfo,
      }) {
        httpRouter.use(
          await createRouter({
            auth,
            logger,
            config,
            discovery,
            httpAuth,
            userInfo,
          }),
        );
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
      },
    });
  },
});
