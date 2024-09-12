import { Issue, Project } from '@axis-backstage/plugin-jira-dashboard-common';

export const getJiraBaseUrl = (a: string) => {
  const url = new URL(a);
  const path = url.pathname.split('/rest/api')[0];
  return url.origin + path;
};

/**
 * Get the URL to a Jira project.
 */
export const getProjectUrl = (project: Project) => {
  return `${getJiraBaseUrl(project.self)}/browse/${project.key}`;
};

/**
 * Get the URL to a issue.
 */
export const getIssueUrl = (issueUrl: string, issueKey: string) => {
  return `${getJiraBaseUrl(issueUrl)}/browse/${issueKey}`;
};

export const transformAssignees = (issues: Issue[]): Issue[] => {
  const unAssigned = {
    name: 'unassigned',
    self: '',
    key: 'unassigned',
    displayName: 'Unassigned',
    avatarUrls: { '48x48': '' },
  };

  return issues.map(issue => {
    if (!issue.fields.assignee) {
      issue.fields.assignee = unAssigned;
    }
    return issue;
  });
};
