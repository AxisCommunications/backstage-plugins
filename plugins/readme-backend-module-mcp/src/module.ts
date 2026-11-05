import { createBackendModule } from '@backstage/backend-plugin-api';
import { coreServices } from '@backstage/backend-plugin-api';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';
import { createGetReadmeContentAction } from './actions/getReadmeContentAction';

/**
 * A backend module for the readme plugin that registers an action with the
 * Actions Registry, making README content available to AI systems through
 * the MCP actions backend plugin.
 *
 * @public
 */
export const readmeMcpActionsModule = createBackendModule({
  pluginId: 'readme',
  moduleId: 'mcp-actions',
  register(env) {
    env.registerInit({
      deps: {
        actionsRegistry: actionsRegistryServiceRef,
        auth: coreServices.auth,
        discovery: coreServices.discovery,
        logger: coreServices.logger,
      },
      async init({ actionsRegistry, auth, discovery, logger }) {
        createGetReadmeContentAction({
          actionsRegistry,
          auth,
          discovery,
          logger,
        });

        logger.info('Registered readme MCP action: get-readme-content');
      },
    });
  },
});

export default readmeMcpActionsModule;
