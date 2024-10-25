import {
  COMPONENTS_NAME,
  PROJECT_KEY_NAME,
  FILTERS_NAME,
  INCOMING_ISSUES_STATUS,
  INSTANCE_NAME,
} from '@axis-backstage/plugin-jira-dashboard-common';

import { JiraConfig } from './config';

export const getAnnotations = (config: JiraConfig) => {
  const prefix = config.annotationPrefix;

  const instanceAnnotation = `${prefix}/${INSTANCE_NAME}`;
  const projectKeyAnnotation = `${prefix}/${PROJECT_KEY_NAME}`;
  const componentsAnnotation = `${prefix}/${COMPONENTS_NAME}`;
  const filtersAnnotation = `${prefix}/${FILTERS_NAME}`;
  const incomingIssuesAnnotation = `${prefix}/${INCOMING_ISSUES_STATUS}`;

  /*   Adding support for Roadie's component annotation */
  const componentRoadieAnnotation = `${prefix}/component`;

  return {
    instanceAnnotation,
    projectKeyAnnotation,
    componentsAnnotation,
    filtersAnnotation,
    incomingIssuesAnnotation,
    componentRoadieAnnotation,
  };
};
