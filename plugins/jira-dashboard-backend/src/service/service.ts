import { CacheService, RootConfigService } from '@backstage/backend-plugin-api';
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

export const getProjectResponse = async (
  projectKey: string,
  config: RootConfigService,
  cache: CacheService,
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

export const getJqlResponse = async (
  jql: string,
  config: RootConfigService,
  cache: CacheService,
  searchOptions: SearchOptions,
): Promise<Issue[]> => {
  let issuesResponse: Issue[];

  issuesResponse = (await cache.get(jql)) as Issue[];

  if (issuesResponse) return issuesResponse as Issue[];

  try {
    issuesResponse = await searchJira(config, jql, searchOptions);
    cache.set(jql, issuesResponse);
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
  config: RootConfigService,
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
  config: RootConfigService,
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
  config: RootConfigService,
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
  config: RootConfigService,
): Promise<JiraDataResponse[]> => {
  return await Promise.all(
    componentAnnotations.map(async componentKey => ({
      name: componentKey,
      type: 'component',
      issues: await getIssuesByComponent(projectKey, componentKey, config),
    })),
  );
};
