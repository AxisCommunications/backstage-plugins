import { CacheClient } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import {
  type Filter,
  type JiraDataResponse,
  type Project,
} from '@axis-backstage/plugin-jira-dashboard-common';
import {
  getFilterById,
  getIssuesByComponent,
  getIssuesByFilter,
  getProjectInfo,
} from '../api';

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
      throw Error(
        `Failed to get project info for project key ${projectKey} with error: ${err.message}`,
      );
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
  projectKey: string,
  components: string[],
  filters: Filter[],
  config: Config,
): Promise<JiraDataResponse[]> => {
  return await Promise.all(
    filters.map(async filter => ({
      name: filter.name,
      type: 'filter',
      issues: await getIssuesByFilter(
        projectKey,
        components,
        filter.query,
        config,
      ),
    })),
  );
};

export const getIssuesFromComponents = async (
  projectKey: string,
  componentAnnotations: string[],
  config: Config,
): Promise<JiraDataResponse[]> => {
  return await Promise.all(
    componentAnnotations.map(async componentKey => ({
      name: componentKey,
      type: 'component',
      issues: await getIssuesByComponent(projectKey, componentKey, config),
    })),
  );
};
