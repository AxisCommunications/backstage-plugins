import { CacheClient } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import {
  JiraAPIResponce,
  type Filter,
  type JiraDataResponse,
  type Project,
} from '@axis-backstage/plugin-jira-dashboard-common';
import { getFilterById, getIssuesByFilter, getProjectInfo } from '../api';
import { Logger } from 'winston';

export const getProjectResponse = async (
  projectKey: string,
  config: Config,
  cache: CacheClient,
): Promise<Project> => {
  let projectResponse: Project;

  projectResponse = (await cache.get(projectKey)) as Project;

  if (projectResponse) return projectResponse as Project;

  try {
    projectResponse = await getProjectInfo(projectKey, config);
    cache.set(projectKey, projectResponse);
  } catch (err: any) {
    if (err.message !== 200) {
      throw Error(`${err.status}`);
    }
  }
  return projectResponse;
};

export const getFiltersFromAnnotations = async (
  annotations: string[],
  config: Config,
): Promise<Filter[]> => {
  const filters: Filter[] = [];

  for (const filter of annotations) {
    try {
      const response = await getFilterById(filter, config);
      filters.push(response);
    } catch (err: any) {
      console.warn(
        `${err.message} : Could not find filter with filter id ${filter}`,
      );
    }
  }
  return filters;
};
export const getIssuesFromFilters = async (
  filters: Filter[],
  queryPrefix: string,
  config: Config,
  logger: Logger,
): Promise<JiraDataResponse[]> => {
  return await Promise.all(
    filters.map(async filter => {
      const query = `${queryPrefix}${filter.query}`;
      const response: JiraAPIResponce = await getIssuesByFilter(
        query,
        config,
        logger,
      );
      return {
        name: filter.name,
        type: 'filter',
        issues: response.issues,
        query,
        errorMessages: response.errorMessages,
      };
    }),
  );
};

export const getIssuesFromComponents = async (
  queryPrefix: string,
  componentAnnotations: string[],
  config: Config,
  logger: Logger,
): Promise<JiraDataResponse[]> => {
  return await Promise.all(
    componentAnnotations.map(async componentKey => {
      const query = `${queryPrefix}'${componentKey}'`;
      const response: JiraAPIResponce = await getIssuesByFilter(
        query,
        config,
        logger,
      );
      return {
        name: `All open issues on jira component "${componentKey}"`,
        type: 'component',
        issues: response.issues,
        query,
        errorMessages: response.errorMessages,
      };
    }),
  );
};
