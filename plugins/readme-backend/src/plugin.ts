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
        auth: coreServices.auth,
        config: coreServices.rootConfig,
        discovery: coreServices.discovery,
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        reader: coreServices.urlReader,
        cache: coreServices.cache,
      },
      async init({
        auth,
        logger,
        config,
        reader,
        discovery,
        httpRouter,
        cache,
      }) {
        httpRouter.use(
          await createRouter({
            auth,
            logger,
            config,
            reader,
            discovery,
            cache,
          }),
        );
      },
    });
  },
});
