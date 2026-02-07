import { Config, readDurationFromConfig } from '@backstage/config';
import { durationToMilliseconds } from '@backstage/types';
import {
  SchedulerServiceTaskScheduleDefinition,
  readSchedulerServiceTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-plugin-api';

export const getCacheTtl = (config: Config): number => {
  const readmeConfig = config.getOptionalConfig('readme');
  if (!readmeConfig) {
    return 3_600_000; // 1 hour default
  }

  if (!readmeConfig.has('cacheTtl')) {
    return 3_600_000; // 1 hour default
  }

  return durationToMilliseconds(
    readDurationFromConfig(readmeConfig, { key: 'cacheTtl' }),
  );
};

export const getSearchSchedule = (
  config: Config,
): SchedulerServiceTaskScheduleDefinition => {
  const readmeConfig = config.getOptionalConfig('readme');
  const searchConfig = readmeConfig?.getOptionalConfig('search');
  const scheduleConfig = searchConfig?.getOptionalConfig('schedule');

  if (!scheduleConfig) {
    // Default to running every hour
    return {
      frequency: { hours: 1 },
      timeout: { hours: 1 },
      initialDelay: { seconds: 3 },
    };
  }

  // Use the official Backstage helper to parse the schedule config
  return readSchedulerServiceTaskScheduleDefinitionFromConfig(scheduleConfig);
};
