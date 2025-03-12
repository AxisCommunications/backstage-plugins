import {
  compatWrapper,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { rootRouteRef } from '../routes';

import React from 'react';
import { configApiRef } from '@backstage/core-plugin-api';
import { isJiraDashboardAvailable } from '..';
/**
 * @alpha
 */
export const entityJiraContent = EntityContentBlueprint.makeWithOverrides({
  name: 'entity',
  factory: (originalFactory, { apis }) => {
    const annotationPrefix =
      apis
        .get(configApiRef)
        ?.getOptionalConfig('jiraDashboard')
        ?.getOptionalString('annotationPrefix') || 'jira.com';
    return originalFactory({
      defaultPath: '/jira',
      defaultTitle: 'Jira Dashboard',
      filter: entity => isJiraDashboardAvailable(entity, annotationPrefix),
      routeRef: convertLegacyRouteRef(rootRouteRef),
      loader: async () =>
        import('../components/JiraDashboardContent').then(m =>
          compatWrapper(<m.JiraDashboardContent />),
        ),
    });
  },
});
