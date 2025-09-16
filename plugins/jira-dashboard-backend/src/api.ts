import fetch, { RequestInit } from 'node-fetch';
import {
  Filter,
  Issue,
  Project,
  JiraQueryResults,
} from '@axis-backstage/plugin-jira-dashboard-common';

import type { ConfigInstance } from './config';
import { jqlQueryBuilder } from './queries';
import type { JiraProject } from './lib';
import { getApiUrl, replaceProjectApiUrl, replaceIssuesApiUrl } from './lib';
import { ResponseError } from '@backstage/errors';

export const getProjectInfo = async (
  project: JiraProject,
): Promise<Project> => {
  const { projectKey, instance } = project;
  const response = await callApi(
    instance,
    `${getApiUrl(instance)}project/${projectKey}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    },
  );
  if (response.status !== 200) {
    throw Error(
      `Request failed with status code ${response.status}: ${response.statusText}`,
    );
  }

  const projectResponse = await response.json();
  replaceProjectApiUrl(project.instance, projectResponse);
  return projectResponse;
};

export const getFilterById = async (
  id: string,
  instance: ConfigInstance,
): Promise<Filter> => {
  const response = await callApi(
    instance,
    `${getApiUrl(instance)}filter/${id}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    },
  );
  if (response.status !== 200) {
    throw Error(`${response.status}`);
  }
  const jsonResponse = await response.json();
  return { name: jsonResponse.name, query: jsonResponse.jql } as Filter;
};

export const getIssuesByFilter = async (
  projects: JiraProject[],
  components: string[],
  query: string,
): Promise<Issue[]> => {
  const issues: Issue[] = [];
  for (const project of projects) {
    const { projectKey, instance } = project;
    const jql = jqlQueryBuilder({ project: [projectKey], components, query });
    const requestUrl = `${getApiUrl(
      instance,
    )}search/jql?jql=${jql}&fields=*all`;
    const response = await callApi(instance, requestUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(resp => resp.json())
      .catch(() => null);
    if (response?.errorMessages) {
      throw Error(
        `JQL returned Error: JQL -  ${jql} with error: ${response?.errorMessages?.[0]}`,
      );
    }
    if (response?.issues) {
      replaceIssuesApiUrl(project.instance, response.issues);
      issues.push(...response.issues);
    }
  }

  return issues;
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
 * Asynchronously searches for Jira issues using JQL.
 *
 * For more information about the available options, see the API documentation at:
 * https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issue-search/#api-rest-api-2-search-post
 *
 * @param config - A Backstage config
 * @param jqlQuery - A string containing the jql query.
 * @param options - Query options that will be passed on to the POST request.
 * @public
 */
export const searchJira = async (
  instance: ConfigInstance,
  jqlQuery: string,
  options: SearchOptions,
): Promise<JiraQueryResults> => {
  const response = await callApi(instance, `${getApiUrl(instance)}search/jql`, {
    method: 'POST',
    body: JSON.stringify({ jql: jqlQuery, ...options }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  const jsonResponse = (await response.json()) as JiraQueryResults;
  replaceIssuesApiUrl(instance, jsonResponse.issues);
  return jsonResponse;
};

export const getIssuesByComponent = async (
  projects: JiraProject[],
  componentKeys: string,
  query?: string,
): Promise<Issue[]> => {
  // Return an empty array if no projects are provided
  if (projects.length === 0) {
    return [];
  }

  const projectKeys = projects.map(project => project.projectKey);
  const components = componentKeys
    .split(',')
    .map(component => component.trim());

  const jql = jqlQueryBuilder({
    project: projectKeys,
    components,
    query,
  });

  const { instance } = projects[0];

  try {
    const response = await callApi(
      instance,
      `${getApiUrl(instance)}search/jql?jql=${jql}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    ).then(resp => resp.json());

    if (!response.issues || response.issues.length === 0) {
      return [];
    }

    replaceIssuesApiUrl(instance, response.issues);
    return response.issues;
  } catch (error: any) {
    if (error.message.includes("does not exist for the field 'project'")) {
      return [];
    }
    throw error;
  }
};
export async function getProjectAvatar(url: string, instance: ConfigInstance) {
  return callApi(instance, url);
}

/**
 * Call the Jira API using fetch.
 *
 * This function injects the auth token and custom headers.
 *
 * @public
 */
export async function callApi(
  instance: ConfigInstance,
  url: string,
  init?: RequestInit,
) {
  const requestInit = init ?? { method: 'GET' };

  // Inject custom headers from config, Authorization token and headers from the
  // request
  requestInit.headers = {
    ...instance.headers,
    Authorization: instance.token,
    ...requestInit.headers,
  };
  return fetch(url, requestInit);
}
