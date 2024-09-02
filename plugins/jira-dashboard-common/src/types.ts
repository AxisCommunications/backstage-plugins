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
      displayName: string;
      avatarUrls: { '48x48': string };
    };
    issuetype: {
      name: string;
      iconUrl: string;
    };
    priority: {
      name: string;
      iconUrl: string;
    };
    updated: string;
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
