import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';

/**
 * Entrypoint for our plugin.
 *
 * @public
 */
export const statuspagePlugin = createBackendPlugin({
  pluginId: 'statuspage',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        httpRouter: coreServices.httpRouter,
      },
      async init({ config, logger, httpRouter }) {
        httpRouter.use(
          await createRouter({
            config,
            logger,
          }),
        );
      },
    });
  },
});
