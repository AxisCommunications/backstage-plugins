import { Project } from '@axis-backstage/plugin-jira-dashboard-common';

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
