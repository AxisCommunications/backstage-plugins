import { Config } from '@backstage/config';
import fetch from 'node-fetch';
import {
  Filter,
  Issue,
  Project,
} from '@axis-backstage/plugin-jira-dashboard-common';
import { resolveJiraBaseUrl, resolveJiraToken } from './config';

export const getProjectInfo = async (
  projectKey: string,
  config: Config,
): Promise<Project> => {
  const response = await fetch(
    `${resolveJiraBaseUrl(config)}project/${projectKey}`,
    {
      method: 'GET',
      headers: {
        Authorization: resolveJiraToken(config),
        Accept: 'application/json',
      },
    },
  );
  if (response.status !== 200) {
    throw Error(`${response.status}`);
  }
  return response.json();
};

export const getFilterById = async (
  id: string,
  config: Config,
): Promise<Filter> => {
  const response = await fetch(`${resolveJiraBaseUrl(config)}filter/${id}`, {
    method: 'GET',
    headers: {
      Authorization: resolveJiraToken(config),
      Accept: 'application/json',
    },
  });
  if (response.status !== 200) {
    throw Error(`${response.status}`);
  }
  const jsonResponse = await response.json();
  return { name: jsonResponse.name, query: jsonResponse.jql } as Filter;
};

export const getIssuesByFilter = async (
  projectKey: string,
  components: string[],
  query: string,
  config: Config,
): Promise<Issue[]> => {
  let componentQuery = '';
  if (components.length) {
    componentQuery = `AND component in (${components})`;
  }
  const response = await fetch(
    `${resolveJiraBaseUrl(
      config,
    )}search?jql=project in (${projectKey}) ${componentQuery} AND ${query}`,
    {
      method: 'GET',
      headers: {
        Authorization: resolveJiraToken(config),
        Accept: 'application/json',
      },
    },
  ).then(resp => resp.json());
  return response.issues;
};

/**
 * Options available for the Jira JQL query.
 *
 * @public
 */
export type SearchOptions = {
  expand?: string[];
  fields?: string[];
  fieldsByKey?: boolean;
  properties?: string[];
  startAt?: number;
  maxResults?: number;
  validateQuery?: string;
};

/**
 * Search for Jira issues using JQL.
 *
 * For more information about the available options see the API
 * documentation at:
 * https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issue-search/#api-rest-api-2-search-post
 *
 * @param config - A Backstage config
 * @param jqlQuery - A string containing the jql query.
 * @param options - Query options that will be passed on to the POST request.
 *
 * @public
 */
export const searchJira = async (
  config: Config,
  jqlQuery: string,
  options: SearchOptions,
): Promise<Issue[]> => {
  const response = await fetch(`${resolveJiraBaseUrl(config)}search`, {
    method: 'POST',
    body: JSON.stringify({ jql: jqlQuery, ...options }),
    headers: {
      Authorization: resolveJiraToken(config),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(resp => resp.json());
  return response.issues;
};

export const getIssuesByComponent = async (
  projectKey: string,
  componentKey: string,
  config: Config,
): Promise<Issue[]> => {
  const response = await fetch(
    `${resolveJiraBaseUrl(
      config,
    )}search?jql=project=${projectKey} AND component = "${componentKey}"`,
    {
      method: 'GET',
      headers: {
        Authorization: resolveJiraToken(config),
        Accept: 'application/json',
      },
    },
  ).then(resp => resp.json());
  return response.issues;
};

export async function getProjectAvatar(url: string, config: Config) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: resolveJiraToken(config),
    },
  });
  return response;
}
