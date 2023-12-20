import { createRouter } from './service/router';
import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';

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
            logger: loggerToWinstonLogger(logger),
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
