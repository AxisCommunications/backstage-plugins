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
    };
    issuetype: {
      name: string;
      iconUrl: string;
    };
  };
};

export type Filter = {
  name: string;
  query: string;
};

export type JiraDataResponse = {
  name: string;
  type: 'component' | 'filter';
  issues: Issue[];
  query: string;
};

export type Project = {
  name: string;
  key: string;
  description: string;
  avatarUrls: string;
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

export type JiraResponse = {
  project: Project;
  data: JiraDataResponse[];
};
