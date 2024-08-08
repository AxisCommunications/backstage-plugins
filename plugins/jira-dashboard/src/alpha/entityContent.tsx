import {
  compatWrapper,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';
import { createEntityContentExtension } from '@backstage/plugin-catalog-react/alpha';
import { rootRouteRef } from '../routes';

import React from 'react';

/**
 * @alpha
 */
export const entityJiraContent = createEntityContentExtension({
  defaultPath: '/jira',
  defaultTitle: 'Jira Dashboard',
  name: 'entity',
  routeRef: convertLegacyRouteRef(rootRouteRef),
  loader: () =>
    import('../components/JiraDashboardContent').then(m =>
      compatWrapper(<m.JiraDashboardContent />),
    ),
});
