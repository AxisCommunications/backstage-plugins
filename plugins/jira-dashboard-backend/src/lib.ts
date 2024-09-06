import { resolveAnnotationPrefix } from './config';
import {
  COMPONENTS_NAME,
  PROJECT_KEY_NAME,
  FILTERS_NAME,
  INCOMING_ISSUES_STATUS,
} from '@axis-backstage/plugin-jira-dashboard-common';
import { RootConfigService } from '@backstage/backend-plugin-api';

export const getAnnotations = (config: RootConfigService) => {
  const prefix = resolveAnnotationPrefix(config);

  const projectKeyAnnotation = `${prefix}/${PROJECT_KEY_NAME}`;
  const componentsAnnotation = `${prefix}/${COMPONENTS_NAME}`;
  const filtersAnnotation = `${prefix}/${FILTERS_NAME}`;
  const incomingIssuesAnnotation = `${prefix}/${INCOMING_ISSUES_STATUS}`;

  /*   Adding support for Roadie's component annotation */
  const componentRoadieAnnotation = `${prefix}/component`;

  return {
    projectKeyAnnotation,
    componentsAnnotation,
    filtersAnnotation,
    incomingIssuesAnnotation,
    componentRoadieAnnotation,
  };
};
