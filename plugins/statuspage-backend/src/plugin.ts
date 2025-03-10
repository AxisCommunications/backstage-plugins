import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';

/**
 * Entrypoint for status page plugin.
 *
 * @public
 */
export const statuspagePlugin = createBackendPlugin({
  pluginId: 'statuspage',
  register(env) {
    env.registerInit({
      deps: {
        cache: coreServices.cache,
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        rootConfig: coreServices.rootConfig,
      },
      async init({ cache, httpRouter, logger, rootConfig }) {
        httpRouter.use(
          await createRouter({
            rootConfig,
            logger,
            cache,
          }),
        );
      },
    });
  },
});
