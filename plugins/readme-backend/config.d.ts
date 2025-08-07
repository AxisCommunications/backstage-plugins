import { HumanDuration } from '@backstage/types';

export interface Config {
  /**
   * Configuration options for the Readme backend plugin
   */
  readme?: {
    /**
     * Optional list of file names to try. Specifies the file names to try
     * when looking for a README file and which order to use.
     */
    fileNames?: string[];
    /**
     * Optional cache TTL, defaults to 1 hour.
     */
    cacheTtl?: HumanDuration | string;
  };
}
