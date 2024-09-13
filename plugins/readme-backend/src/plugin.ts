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
        httpRouter: coreServices.httpRouter,
      },
      async init({ auth, logger, config, reader, discovery, httpRouter }) {
        httpRouter.use(
          await createRouter({
            auth,
            logger,
            config,
            reader,
            discovery,
          }),
        );
      },
    });
  },
});
