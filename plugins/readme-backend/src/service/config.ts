import { Config, readDurationFromConfig } from '@backstage/config';
import { durationToMilliseconds } from '@backstage/types';

const CACHE_CONFIG_KEY = 'readme.cacheTtl';

export const getCacheTtl = (config: Config): number =>
  config.has(CACHE_CONFIG_KEY)
    ? durationToMilliseconds(
        readDurationFromConfig(config, { key: CACHE_CONFIG_KEY }),
      )
    : 3_600_000;
