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
  filterName: string,
): Promise<Issue[]> => {
  let jql = `assignee = "${username}" AND resolution = Unresolved ORDER BY priority DESC, updated DESC`;
  if (filterName !== 'default') {
    for (const filter of config.defaultFilters || []) {
      if (filterName === filter.name) {
        jql = `assignee = "${username}" AND ${filter.query}`;
      }
    }
  }

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
async function getJiraProjectsFromKeys(
  projectKeys: string[],
  instance: ConfigInstance,
  cache: CacheService,
): Promise<JiraProject[]> {
  const jiraProjects: JiraProject[] = [];
  for (const key of projectKeys) {
    const cachedProject = (await cache.get(key)) as Project;
    let projectInfo: Project;

    if (cachedProject) {
      projectInfo = cachedProject;
    } else {
      projectInfo = await getProjectInfo({
        projectKey: key,
        instance,
        fullProjectKey: '',
      });
      cache.set(key, projectInfo);
    }

    jiraProjects.push({
      instance,
      fullProjectKey: projectInfo.key,
      projectKey: projectInfo.key,
    });
  }
  return jiraProjects;
}
export const getIssuesFromFilters = async (
  projectKeys: string[],
  components: string[],
  filters: Filter[],
  instance: ConfigInstance,
  cache: CacheService,
  jqlAnnotation?: string,
): Promise<JiraDataResponse[]> => {
  const projects = await getJiraProjectsFromKeys(projectKeys, instance, cache);
  return await Promise.all(
    filters.map(async filter => {
      const combinedQuery = `${jqlAnnotation ? `(${jqlAnnotation}) AND ` : ''}${
        filter.query
      }`;
      return {
        name: filter.name,
        query: jqlQueryBuilder({
          project: projectKeys,
          components,
          query: combinedQuery,
        }),
        type: 'filter',
        issues: await getIssuesByFilter(projects, components, combinedQuery),
      };
    }),
  );
};

export const getIssuesFromComponents = async (
  projectKeys: string[],
  componentAnnotations: string[],
  instance: ConfigInstance,
  cache: CacheService,
  jqlAnnotation?: string,
): Promise<JiraDataResponse[]> => {
  const projects = await getJiraProjectsFromKeys(projectKeys, instance, cache);
  return await Promise.all(
    componentAnnotations.map(async componentKey => ({
      name: componentKey,
      query: jqlQueryBuilder({
        project: projectKeys,
        components: [componentKey],
        query: jqlQueryBuilder({
          project: projectKeys,
          components: componentAnnotations,
          query: jqlAnnotation,
        }),
      }),
      type: 'component',
      issues: await getIssuesByComponent(projects, componentKey, jqlAnnotation),
    })),
  );
};
