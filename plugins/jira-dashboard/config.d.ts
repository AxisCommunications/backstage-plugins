export interface Config {
  /**
   * Configuration options for the Jira Dashboard plugin
   */
  jiraDashboard: {
    /**
     * Optional annotation prefix for retrieving a custom annotation. Defaut value is jira.com
     * @visibility frontend
     */
    annotationPrefix?: string;
  };
}
