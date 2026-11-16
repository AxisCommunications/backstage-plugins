/**
 * A search backend module that indexes the README files of catalog entities.
 *
 * @packageDocumentation
 */

import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { searchIndexRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';
import { DefaultReadmeCollatorFactory } from './collator/DefaultReadmeCollatorFactory';
import { readScheduleConfigOptions } from './collator/config';

/**
 * Search backend module for the Readme index.
 *
 * @public
 */
export const searchModuleReadmeCollator = createBackendModule({
  pluginId: 'search',
  moduleId: 'readme',
  register(env) {
    env.registerInit({
      deps: {
        auth: coreServices.auth,
        catalog: catalogServiceRef,
        config: coreServices.rootConfig,
        discovery: coreServices.discovery,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
        indexRegistry: searchIndexRegistryExtensionPoint,
      },
      async init({
        auth,
        catalog,
        config,
        discovery,
        logger,
        scheduler,
        indexRegistry,
      }) {
        indexRegistry.addCollator({
          schedule: scheduler.createScheduledTaskRunner(
            readScheduleConfigOptions(config),
          ),
          factory: DefaultReadmeCollatorFactory.fromConfig(config, {
            auth,
            catalog,
            discovery,
            logger,
          }),
        });
      },
    });
  },
});

export default searchModuleReadmeCollator;
