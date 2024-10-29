import fetch from 'node-fetch';
import {
  Filter,
  Issue,
  Project,
} from '@axis-backstage/plugin-jira-dashboard-common';

import type { ConfigInstance } from './config';
import { jqlQueryBuilder } from './queries';
import type { JiraProject } from './lib';

export const getProjectInfo = async (
  project: JiraProject,
): Promise<Project> => {
  const { projectKey, instance } = project;
  const response = await fetch(`${instance.baseUrl}project/${projectKey}`, {
    method: 'GET',
    headers: {
      Authorization: instance.token,
      Accept: 'application/json',
    },
  });
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
  const response = await fetch(`${instance.baseUrl}filter/${id}`, {
    method: 'GET',
    headers: {
      Authorization: instance.token,
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
  project: JiraProject,
  components: string[],
  query: string,
): Promise<Issue[]> => {
  const { projectKey, instance } = project;
  const jql = jqlQueryBuilder({ project: projectKey, components, query });
  const response = await fetch(`${instance.baseUrl}search?jql=${jql}`, {
    method: 'GET',
    headers: {
      Authorization: instance.token,
      Accept: 'application/json',
    },
  }).then(resp => resp.json());
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
 * @public
 */
export const searchJira = async (
  instance: ConfigInstance,
  jqlQuery: string,
  options: SearchOptions,
): Promise<Issue[]> => {
  const response = await fetch(`${instance.baseUrl}search`, {
    method: 'POST',
    body: JSON.stringify({ jql: jqlQuery, ...options }),
    headers: {
      Authorization: instance.token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(resp => resp.json());
  return response.issues;
};

export const getIssuesByComponent = async (
  project: JiraProject,
  componentKey: string,
): Promise<Issue[]> => {
  const { projectKey, instance } = project;

  const jql = jqlQueryBuilder({
    project: projectKey,
    components: [componentKey],
  });
  const response = await fetch(`${instance.baseUrl}search?jql=${jql}`, {
    method: 'GET',
    headers: {
      Authorization: instance.token,
      Accept: 'application/json',
    },
  }).then(resp => resp.json());
  return response.issues;
};

export async function getProjectAvatar(url: string, instance: ConfigInstance) {
  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: instance.token,
    },
  });
}
