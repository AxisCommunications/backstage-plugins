import {
  createExtensionDataRef,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import {
  compatWrapper,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { rootRouteRef } from '../routes';

import React from 'react';

/**
 * Extension for the Jira plugin that enables the customization of the annotation prefix
 * @alpha
 */
export const annotationPrefixExtensionDataRef =
  createExtensionDataRef<string>().with({ id: 'annotationPrefix' });

/**
 * @alpha
 */
export const entityJiraContent = EntityContentBlueprint.makeWithOverrides({
  name: 'entity',
  inputs: {
    props: createExtensionInput([annotationPrefixExtensionDataRef.optional()], {
      singleton: true,
      optional: true,
    }),
  },
  factory: (originalFactory, { inputs }) => {
    return originalFactory({
      defaultPath: '/jira',
      defaultTitle: 'Jira Dashboard',
      filter: 'kind:component,group',
      routeRef: convertLegacyRouteRef(rootRouteRef),
      loader: async () =>
        import('../components/JiraDashboardContent').then(m =>
          compatWrapper(
            <m.JiraDashboardContent
              annotationPrefix={inputs.props?.get(
                annotationPrefixExtensionDataRef.optional(),
              )}
            />,
          ),
        ),
    });
  },
});
