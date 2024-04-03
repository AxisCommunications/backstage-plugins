import { Config } from '@backstage/config';
import fetch from 'node-fetch';
import {
  Filter,
  Issue,
  JiraQueryResults,
  Project,
  SearchJiraResponse,
} from '@axis-backstage/plugin-jira-dashboard-common';
import { resolveJiraBaseUrl, resolveJiraToken } from './config';
import { Logger } from 'winston';

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
 * This function sends a POST request to the Jira API's search endpoint
 * to find issues based on the provided JQL query and query options.
 *
 * For more information about the available options, refer to the API
 * documentation at: {@link https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issue-search/#api-rest-api-2-search-post}
 *
 * @param config - A Backstage config containing Jira base URL and authentication token.
 * @param jqlQuery - A string containing the JQL (Jira Query Language) query.
 * @param options - Additional search options to customize the query. See {@link SearchOptions}.
 * @param logger - An optional logger for error handling and debugging purposes.
 * @returns A promise that resolves with the search results and status code.
 * @throws If an error occurs during the search process.
 * @public
 */
export const searchJira = async (
  jqlQuery: string,
  options: SearchOptions,
  config: Config,
  logger: Logger,
): Promise<SearchJiraResponse> => {
  try {
    const response = await fetch(`${resolveJiraBaseUrl(config)}search`, {
      method: 'POST',
      body: JSON.stringify({ jql: jqlQuery, ...options }),
      headers: {
        Authorization: resolveJiraToken(config),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const jsonResponse = await response.json();

    return {
      results: toPaginatedResponse(jsonResponse),
      statusCode: response.status,
    } as SearchJiraResponse;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

function toPaginatedResponse(response: any): JiraQueryResults {
  return {
    expand: response.expand,
    names: response.names,
    schema: response.schema,
    issues: response.issues,
    total: response.total,
    startAt: response.startAt,
    maxResults: response.maxResults,
    warningMessages: response.warningMessages,
    errorMessages: response.errorMessages,
  };
}

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
