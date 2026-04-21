import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
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
        catalogApi: catalogServiceRef,
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        reader: coreServices.urlReader,
        cache: coreServices.cache,
      },
      async init({
        auth,
        logger,
        catalogApi,
        config,
        reader,
        httpRouter,
        cache,
      }) {
        httpRouter.use(
          await createRouter({
            auth,
            logger,
            catalogApi,
            config,
            reader,
            cache,
          }),
        );
      },
    });
  },
});
