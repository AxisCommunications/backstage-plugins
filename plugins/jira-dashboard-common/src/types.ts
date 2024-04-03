/**
 * Type for defining a Jira issue
 *  @public
 */
export type Issue = {
  key: string;
  self: string;
  fields: {
    summary: string;
    status: {
      name: string;
    };
    assignee: {
      name: string;
      self: string;
      key: string;
    };
    issuetype: {
      name: string;
      iconUrl: string;
    };
  };
};

/**
 * Type for defining a Jira filter
 *  @public
 */
export type Filter = {
  name: string;
  query: string;
  shortName: string;
};

/**
 * Type for defining JiraDataResponse
 *  @public
 */
export type JiraDataResponse = {
  name: string;
  type: 'component' | 'filter';
  issues: Issue[];
};

/**
 * Type for defining a Jira project
 *  @public
 */
export type Project = {
  name: string;
  key: string;
  description: string;
  avatarUrls: { '48x48': string };
  projectTypeKey: string;
  projectCategory?: {
    name: string;
  };
  lead: {
    key: string;
    displayName: string;
  };
  self: string;
};

/**
 * Type for defining JiraResponse
 *  @public
 */
export type JiraResponse = {
  project: Project;
  data: JiraDataResponse[];
};

/**
 * Type definition for a Jira search result & the recieved HTTP status code
 * @public
 */
export type SearchJiraResponse = {
  results: JiraQueryResults;
  statusCode: number;
};

/**
 * Type definition for a paginated Jira search response
 * @public
 */
export type JiraQueryResults = {
  expand: string;
  names: object;
  schema: object;
  issues: Issue[];
  total: number;
  startAt: number;
  maxResults: number;
  warningMessages?: string[];
  errorMessages?: string[];
};
