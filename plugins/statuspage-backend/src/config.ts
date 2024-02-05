import { Config } from '@backstage/config';
import type { StatuspageConfig } from './types';

export function getStatuspageConfig(config: Config): StatuspageConfig {
  const statuspageConfig = config.getOptional('statuspage');
  if (!statuspageConfig) {
    return [];
  }
  return statuspageConfig as unknown as StatuspageConfig;
}
