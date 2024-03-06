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
      displayName: string;
      name: string;
      self: string;
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
 * Type for defining JiraAPIResponce
 *  @public
 */
export type JiraAPIResponce = {
  issues: Issue[] | undefined;
  errorMessages: string[] | undefined;
};

/**
 * Type for defining JiraDataResponse
 *  @public
 */
export type JiraDataResponse = {
  name: string;
  type: 'component' | 'filter';
  issues: Issue[] | undefined;
  query: string;
  errorMessages: string[] | undefined;
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
  projectCategory: {
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
