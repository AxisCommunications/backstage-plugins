import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';

/**
 * The Readme backend plugin.
 *
 * @public
 */
export const readmePlugin = createBackendPlugin({
  pluginId: 'readme',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        reader: coreServices.urlReader,
        discovery: coreServices.discovery,
        auth: coreServices.auth,
        tokenManager: coreServices.tokenManager,
        httpRouter: coreServices.httpRouter,
      },
      async init({
        logger,
        config,
        reader,
        discovery,
        tokenManager,
        httpRouter,
      }) {
        httpRouter.use(
          await createRouter({
            logger,
            config,
            reader,
            discovery,
            tokenManager,
          }),
        );
      },
    });
  },
});
