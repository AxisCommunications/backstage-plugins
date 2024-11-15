import { CacheService } from '@backstage/backend-plugin-api';
import {
  type Filter,
  Issue,
  type JiraDataResponse,
  type Project,
} from '@axis-backstage/plugin-jira-dashboard-common';
import {
  getFilterById,
  getIssuesByComponent,
  getIssuesByFilter,
  getProjectInfo,
  searchJira,
  SearchOptions,
} from '../api';
import { jqlQueryBuilder } from '../queries';
import type { ConfigInstance } from '../config';
import { JiraProject } from '../lib';

export const getProjectResponse = async (
  project: JiraProject,
  cache: CacheService,
): Promise<Project> => {
  let projectResponse: Project;

  projectResponse = (await cache.get(project.fullProjectKey)) as Project;

  if (projectResponse) {
    return projectResponse as Project;
  }

  try {
    projectResponse = await getProjectInfo(project);
    cache.set(project.fullProjectKey, projectResponse);
  } catch (err: any) {
    if (err.message !== 200) {
      throw Error(
        `Failed to get project info for project key ${project.fullProjectKey} with error: ${err.message}`,
      );
    }
  }
  return projectResponse;
};

export const getJqlResponse = async (
  jql: string,
  config: ConfigInstance,
  cache: CacheService,
  searchOptions: SearchOptions,
): Promise<Issue[]> => {
  let issuesResponse: Issue[];

  const cacheKey = `${config.baseUrl} ${jql}`;

  issuesResponse = (await cache.get(cacheKey)) as Issue[];

  if (issuesResponse) {
    return issuesResponse;
  }

  try {
    issuesResponse = (await searchJira(config, jql, searchOptions)).issues;
    cache.set(cacheKey, issuesResponse);
  } catch (err: any) {
    if (err.message !== 200) {
      throw Error(
        `Failed to get issues for JQL ${jql} with error: ${err.message}`,
      );
    }
  }
  return issuesResponse;
};

export const getUserIssues = async (
  username: string,
  maxResults: number,
  config: ConfigInstance,
  cache: CacheService,
): Promise<Issue[]> => {
  const jql = `assignee = "${username}" AND resolution = Unresolved ORDER BY priority DESC, updated DESC`;

  return getJqlResponse(jql, config, cache, {
    fields: [
      'key',
      'issuetype',
      'summary',
      'status',
      'priority',
      'created',
      'updated',
    ],
    maxResults,
  });
};

export const getFiltersFromAnnotations = async (
  annotations: string[],
  config: ConfigInstance,
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
  project: JiraProject,
  components: string[],
  filters: Filter[],
): Promise<JiraDataResponse[]> => {
  return await Promise.all(
    filters.map(async filter => ({
      name: filter.name,
      query: jqlQueryBuilder({
        project: project.projectKey,
        components,
        query: filter.query,
      }),
      type: 'filter',
      issues: await getIssuesByFilter(project, components, filter.query),
    })),
  );
};

export const getIssuesFromComponents = async (
  project: JiraProject,
  componentAnnotations: string[],
): Promise<JiraDataResponse[]> => {
  return await Promise.all(
    componentAnnotations.map(async componentKey => ({
      name: componentKey,
      query: jqlQueryBuilder({
        project: project.projectKey,
        components: [componentKey],
      }),
      type: 'component',
      issues: await getIssuesByComponent(project, componentKey),
    })),
  );
};
