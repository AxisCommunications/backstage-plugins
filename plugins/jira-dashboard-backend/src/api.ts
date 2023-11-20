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
  query: string,
  config: Config,
): Promise<Issue[]> => {
  const response = await fetch(
    `${resolveJiraBaseUrl(
      config,
    )}search?jql=project=${projectKey} AND ${query}`,
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
