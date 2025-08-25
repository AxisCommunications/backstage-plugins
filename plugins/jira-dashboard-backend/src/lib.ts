import {
  COMPONENTS_NAME,
  PROJECT_KEY_NAME,
  FILTERS_NAME,
  INCOMING_ISSUES_STATUS,
  Project,
  Issue,
  JQL,
} from '@axis-backstage/plugin-jira-dashboard-common';

import type { ConfigInstance, JiraConfig } from './config';

export const getAnnotations = (config: JiraConfig) => {
  const prefix = config.annotationPrefix;

  const projectKeyAnnotation = `${prefix}/${PROJECT_KEY_NAME}`;
  const componentsAnnotation = `${prefix}/${COMPONENTS_NAME}`;
  const filtersAnnotation = `${prefix}/${FILTERS_NAME}`;
  const jqlAnnotation = `${prefix}/${JQL}`;
  const incomingIssuesAnnotation = `${prefix}/${INCOMING_ISSUES_STATUS}`;

  /*   Adding support for Roadie's component annotation */
  const componentRoadieAnnotation = `${prefix}/component`;

  return {
    projectKeyAnnotation,
    componentsAnnotation,
    filtersAnnotation,
    jqlAnnotation,
    incomingIssuesAnnotation,
    componentRoadieAnnotation,
  };
};

export interface JiraProject {
  instance: ConfigInstance;
  fullProjectKey: string;
  projectKey: string;
}

/**
 * Splits a project key "instance/key" into a config instance and a project
 * key, falling back to 'default' for unprefixed keys
 */
export function splitProjectKey(
  config: JiraConfig,
  fullProjectKey: string,
): JiraProject {
  const [instance, projectKey] = fullProjectKey.split('/');
  if (!projectKey) {
    // No specific instance specified - use default
    return {
      instance: config.getInstance(),
      fullProjectKey,
      projectKey: instance,
    };
  }

  return {
    instance: config.getInstance(instance),
    fullProjectKey,
    projectKey,
  };
}

export function getApiUrl(instance: ConfigInstance) {
  return instance.apiUrl || instance.baseUrl;
}

export function replaceProjectApiUrl(
  instance: ConfigInstance,
  project: Project,
) {
  if (instance.apiUrl) {
    const apiUrl = instance.apiUrl;
    project.self = project.self.replace(apiUrl, instance.baseUrl);
  }
}

export function replaceIssuesApiUrl(instance: ConfigInstance, issues: Issue[]) {
  if (instance.apiUrl) {
    const apiUrl = instance.apiUrl;
    issues.forEach(
      issue => (issue.self = issue.self.replace(apiUrl, instance.baseUrl)),
    );
  }
}
