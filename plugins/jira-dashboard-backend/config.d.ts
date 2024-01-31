export interface Config {
  /** Configuration options for the Jira Dashboard plugin */
  jiraDashboard: {
    /**
     * The API token to authenticate towards Jira. It can be found by visiting Atlassians page at https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/
     * @visibility secret
     */
    token: string;

    /**
     * The base url for Jira in your company, including the API version. For instance: https://jira.se.your-company.com/rest/api/2/'
     */
    baseUrl: string;

    /**
     * The email suffix used for retreiving a specific Jira user in a company. For instance @your-company.com
     */
    userEmailSuffix: string;

    /**
     * Optional annotation prefix for retrieving a specific Jira annotation from catalog-info.yaml. Defaut value is jira.com
     * @visibility frontend
     */
    annotationPrefix?: string;
  };
}
