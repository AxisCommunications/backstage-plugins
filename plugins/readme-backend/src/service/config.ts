import { Config, readDurationFromConfig } from '@backstage/config';
import { durationToMilliseconds, HumanDuration } from '@backstage/types';
import { SchedulerServiceTaskScheduleDefinition } from '@backstage/backend-plugin-api';

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

  // frequency is required if schedule is provided (per config.d.ts)
  const frequency = readScheduleFrequency(scheduleConfig, 'frequency');

  // timeout and initialDelay are optional
  const timeout = scheduleConfig.has('timeout')
    ? readDurationFromConfig(scheduleConfig, { key: 'timeout' })
    : { hours: 1 };

  const initialDelay = scheduleConfig.has('initialDelay')
    ? readDurationFromConfig(scheduleConfig, { key: 'initialDelay' })
    : { seconds: 3 };

  return {
    frequency,
    timeout,
    initialDelay,
  };
};

function readScheduleFrequency(
  config: Config,
  key: string,
): HumanDuration | { cron: string } | { trigger: 'manual' } {
  const value = config.get(key);

  // Check if it's a cron expression
  if (typeof value === 'object' && value !== null && 'cron' in value) {
    return value as { cron: string };
  }

  // Check if it's a manual trigger
  if (typeof value === 'object' && value !== null && 'trigger' in value) {
    return value as { trigger: 'manual' };
  }

  // Otherwise, read as duration (string or HumanDuration object)
  return readDurationFromConfig(config, { key });
}
