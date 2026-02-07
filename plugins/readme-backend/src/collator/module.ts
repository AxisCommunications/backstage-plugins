import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { searchIndexRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';
import { getSearchSchedule } from '../service/config';
import { ReadmeCollatorFactory } from './ReadmeCollatorFactory';

/**
 * Search backend module for the README plugin.
 * Registers the README collator with the search backend.
 *
 * @public
 */
export const readmeSearchModule = createBackendModule({
  pluginId: 'search',
  moduleId: 'readme-collator',
  register(env) {
    env.registerInit({
      deps: {
        auth: coreServices.auth,
        cache: coreServices.cache,
        config: coreServices.rootConfig,
        discovery: coreServices.discovery,
        logger: coreServices.logger,
        reader: coreServices.urlReader,
        scheduler: coreServices.scheduler,
        searchIndexRegistry: searchIndexRegistryExtensionPoint,
      },
      async init({
        auth,
        cache,
        config,
        discovery,
        logger,
        reader,
        scheduler,
        searchIndexRegistry,
      }) {
        const scheduleConfig = getSearchSchedule(config);

        searchIndexRegistry.addCollator({
          schedule: scheduler.createScheduledTaskRunner(scheduleConfig),
          factory: ReadmeCollatorFactory.fromConfig({
            auth,
            cache,
            config,
            discovery,
            logger: logger.child({ collator: 'readme' }),
            reader,
          }),
        });

        logger.info('README search collator registered');
      },
    });
  },
});
