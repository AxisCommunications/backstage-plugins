import { Project } from '@axis-backstage/plugin-jira-dashboard-common';

/**
 * Get the URL to the Jira host.
 */
export const getJiraUrl = (project: Project) => {
  const url = new URL(project.self);
  return `https://${url.host}/`;
};

/**
 * Get the URL to a Jira project.
 */
export const getProjectUrl = (project: Project) => {
  const url = new URL(project.self);
  return `https://${url.host}/browse/${project.key}`;
};

/**
 * Get the URL to a issue.
 */
export const getIssueUrl = (issueUrl: string, issueKey: string) => {
  const url = new URL(issueUrl);
  return `https://${url.host}/browse/${issueKey}`;
};
