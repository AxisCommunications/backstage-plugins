export interface Config {
  /**
   * Configuration for the StatusPage plugin.
   * @visibility backend
   */
  statuspage: {
    /**
     * The name of the instance
     * @visibility backend
     */
    name: string;

    /**
     * The page id of the your statuspage
     * @visibility backend
     */
    pageid: string;

    /**
     * Client access token
     * @visibility secret
     */
    token: string;

    /**
     * Link to the statuspage
     */
    link?: string;
  }[];
}
