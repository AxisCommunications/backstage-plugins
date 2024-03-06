import { Config } from '@backstage/config';
import {
  Filter,
  JiraAPIResponce,
  Project,
} from '@axis-backstage/plugin-jira-dashboard-common';
import { resolveJiraBaseUrl, resolveJiraToken } from './config';
import { Logger } from 'winston';

export const getProjectInfo = async (
  projectKey: string,
  config: Config,
): Promise<Project> => {
  const response = (await fetch(
    `${resolveJiraBaseUrl(config)}project/${projectKey}`,
    {
      method: 'GET',
      headers: {
        Authorization: resolveJiraToken(config),
        Accept: 'application/json',
      },
    },
  )) as any;
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
    // Return filter id with issues as query so as Error will be logged later
    return {
      name: `Filter-id "${id}" not found`,
      query: `filter = ${id}`,
    } as Filter;
  }
  const jsonResponse = (await response.json()) as any;
  return { name: jsonResponse.name, query: jsonResponse.jql } as Filter;
};

export const getIssuesByFilter = async (
  query: string,
  config: Config,
  logger: Logger,
): Promise<JiraAPIResponce> => {
  const response = await fetch(
    `${resolveJiraBaseUrl(config)}search?jql=${query}`,
    {
      method: 'GET',
      headers: {
        Authorization: resolveJiraToken(config),
        Accept: 'application/json',
      },
    },
  ).then((resp: { json: () => any }) => resp.json() as any);
  if (response.errorMessages?.length > 0)
    response.errorMessages.map((err: string) => logger.error(err));
  return response;
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
