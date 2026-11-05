import {
  SchedulerServiceTaskScheduleDefinition,
  readSchedulerServiceTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-plugin-api';
import {
  AuthService,
  DiscoveryService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { EntityFilterQuery } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import { CatalogService } from '@backstage/plugin-catalog-node';

const configKey = 'search.collators.readme';

const defaults = {
  schedule: {
    frequency: { hours: 1 },
    timeout: { minutes: 15 },
    initialDelay: { seconds: 3 },
  },
  collatorOptions: {
    locationTemplate: '/catalog/:namespace/:kind/:name',
    filter: undefined,
    parallelismLimit: 10,
  },
};

/**
 * Options for {@link DefaultReadmeCollatorFactory}.
 *
 * @public
 */
export interface ReadmeCollatorFactoryOptions {
  /** The authentication service. */
  auth: AuthService;
  /** The catalog service, used to list entities. */
  catalog: CatalogService;
  /** The discovery service, used to locate the readme backend. */
  discovery: DiscoveryService;
  /** The logger service. */
  logger: LoggerService;
}

/**
 * Reads the collator schedule from configuration.
 */
export function readScheduleConfigOptions(
  configRoot: Config,
): SchedulerServiceTaskScheduleDefinition {
  let schedule: SchedulerServiceTaskScheduleDefinition | undefined = undefined;

  const config = configRoot.getOptionalConfig(configKey);
  if (config) {
    const scheduleConfig = config.getOptionalConfig('schedule');
    if (scheduleConfig) {
      try {
        schedule =
          readSchedulerServiceTaskScheduleDefinitionFromConfig(scheduleConfig);
      } catch (error) {
        throw new InputError(`Invalid schedule at ${configKey}, ${error}`);
      }
    }
  }

  return schedule ?? defaults.schedule;
}

/**
 * Reads the collator options from configuration.
 */
export function readCollatorConfigOptions(configRoot: Config): {
  locationTemplate: string;
  filter: EntityFilterQuery | undefined;
  parallelismLimit: number;
} {
  const config = configRoot.getOptionalConfig(configKey);
  if (!config) {
    return defaults.collatorOptions;
  }

  return {
    locationTemplate:
      config.getOptionalString('locationTemplate') ??
      defaults.collatorOptions.locationTemplate,
    filter:
      config.getOptional<EntityFilterQuery>('filter') ??
      defaults.collatorOptions.filter,
    parallelismLimit:
      config.getOptionalNumber('parallelismLimit') ??
      defaults.collatorOptions.parallelismLimit,
  };
}
