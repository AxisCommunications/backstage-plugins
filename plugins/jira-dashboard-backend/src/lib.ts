import { resolveAnnotationPrefix } from './config';
import {
  COMPONENTS_NAME,
  PROJECT_KEY_NAME,
  FILTERS_NAME,
} from '@axis-backstage/plugin-jira-dashboard-common';
import { Config } from '@backstage/config';

export const getAnnotations = (config: Config) => {
  const prefix = resolveAnnotationPrefix(config);

  const projectKeyAnnotation = `${prefix}/${PROJECT_KEY_NAME}`;
  const componentsAnnotation = `${prefix}/${COMPONENTS_NAME}`;
  const filtersAnnotation = `${prefix}/${FILTERS_NAME}`;

  return {
    projectKeyAnnotation,
    componentsAnnotation,
    filtersAnnotation,
  };
};
