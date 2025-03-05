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
import { ResponseError } from '@backstage/errors';

export const getProjectInfo = async (
  project: JiraProject,
): Promise<Project> => {
  const { projectKey, instance } = project;
  const response = await callApi(
    instance,
    `${instance.baseUrl}project/${projectKey}`,
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
  return response.json();
};

export const getFilterById = async (
  id: string,
  instance: ConfigInstance,
): Promise<Filter> => {
  const response = await callApi(instance, `${instance.baseUrl}filter/${id}`, {
    method: 'GET',
    headers: {
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
  projects: JiraProject[],
  components: string[],
  query: string,
): Promise<Issue[]> => {
  const issues: Issue[] = [];
  for (const project of projects) {
    const { projectKey, instance } = project;
    const jql = jqlQueryBuilder({
      project: [`"${projectKey}\"`],
      components,
      query,
    });
    const response = await callApi(
      instance,
      `${instance.baseUrl}search?jql=${jql}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    )
      .then(resp => resp.json())
      .catch(() => null);
    if (response?.errorMessages) {
      throw Error(
        `JQL returned Error: JQL -  ${jql} with error: ${response?.errorMessages[0]}`,
      );
    }
    if (response?.issues) {
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
  const response = await callApi(instance, `${instance.baseUrl}search`, {
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
  const jsonResponse = await response.json();
  return jsonResponse as JiraQueryResults;
};

export const getIssuesByComponent = async (
  projects: JiraProject[],
  componentKeys: string,
): Promise<Issue[]> => {
  // Return an empty array if no projects are provided
  if (projects.length === 0) {
    return [];
  }

  const projectKeys = projects.map(project => project.projectKey).join(',');
  const components = componentKeys
    .split(',')
    .map(component => `'${component.trim()}'`)
    .join(',');

  const jql = `project in (${projectKeys}) AND component in (${components})`;
  const { instance } = projects[0];

  try {
    const response = await callApi(
      instance,
      `${instance.baseUrl}search?jql=${jql}`,
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
