import { HumanDuration } from '@backstage/types';
import { SchedulerServiceTaskScheduleDefinitionConfig } from '@backstage/backend-plugin-api';

export interface Config {
  /**
   * Configuration options for the Readme backend plugin
   */
  readme?: {
    /**
     * Optional list of file names to try. Specifies the file names to try
     * when looking for a README file and which order to use.
     *
     * @example
     * ```yaml
     * readme:
     *   fileNames:
     *     - README.md
     *     - README.rst
     *     - README.txt
     * ```
     */
    fileNames?: string[];
    /**
     * Optional cache TTL, defaults to 1 hour.
     * Can be specified as a string (e.g., '2h', '30m') or as an object.
     *
     * @example
     * ```yaml
     * readme:
     *   cacheTtl: '2h'
     * ```
     *
     * @example
     * ```yaml
     * readme:
     *   cacheTtl:
     *     hours: 2
     * ```
     */
    cacheTtl?: HumanDuration | string;
    /**
     * Search indexing configuration
     */
    search?: {
      /**
       * Schedule configuration for search indexing.
       * Defaults to running every hour with a 1 hour timeout.
       *
       * @example
       * ```yaml
       * readme:
       *   search:
       *     schedule:
       *       frequency: { hours: 1 }
       *       timeout: { hours: 1 }
       *       initialDelay: { seconds: 3 }
       * ```
       *
       * @example Using string format
       * ```yaml
       * readme:
       *   search:
       *     schedule:
       *       frequency: '30m'
       *       timeout: '30m'
       * ```
       *
       * @example Using cron syntax
       * ```yaml
       * readme:
       *   search:
       *     schedule:
       *       frequency:
       *         cron: '0 * * * *'  # Every hour
       * ```
       *
       * @visibility frontend
       */
      schedule?: SchedulerServiceTaskScheduleDefinitionConfig;
    };
  };
}
