export interface Config {
  /**
   * Configuration for the StatusPage plugin.
   * @visibility backend
   */
  statuspage: {
    instances: {
      /**
       * The name of the instance
       * @visibility backend
       */
      name: string;

      /**
       * The name of the instance
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
      link: string;
    }[];
  };
}
