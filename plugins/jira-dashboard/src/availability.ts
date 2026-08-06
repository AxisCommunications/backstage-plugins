import type { Entity } from '@backstage/catalog-model';
import { PROJECT_KEY_NAME } from '@axis-backstage/plugin-jira-dashboard-common';

/**
 * Checks if the entity has a jira.com project-key annotation.
 *
 * @public
 * @param entity - The entity to check for the jira.com project-key annotation.
 */
export const isJiraDashboardAvailable = (
  entity: Entity,
  annotationPrefix?: string,
) =>
  Boolean(
    entity.metadata.annotations?.[
      `${annotationPrefix ?? 'jira.com'}/${PROJECT_KEY_NAME}`
    ],
  );
