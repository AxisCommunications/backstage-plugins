export interface Config {
  app: {
    /**
     * Umami tracking ID.
     * @visibility frontend
     */
    analytics?: {
      umami: {
        /**
         * Umami tracking ID.
         * @visibility frontend
         */
        trackingId: string;

        /**
         * Umami data domain
         * @visibility frontend
         */
        dataDomain: string;

        /**
         * Whether or not to log analytics debug statements to the console.
         * Defaults to false.
         *
         * @visibility frontend
         */
        debug?: boolean;

        /**
         * Prevents events from actually being sent when set to true. Defaults
         * to false.
         *
         * @visibility frontend
         */
        testMode?: boolean;

        /**
         * Enable sending distinct id (derived from Backstage identity) to Umami.
         * Defaults to true.
         */
        enableDistinctId?: boolean;
      };
    };
  };
}
