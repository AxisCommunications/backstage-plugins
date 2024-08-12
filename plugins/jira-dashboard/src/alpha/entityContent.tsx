import {
  createExtensionDataRef,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import {
  compatWrapper,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';
import { createEntityContentExtension } from '@backstage/plugin-catalog-react/alpha';
import { rootRouteRef } from '../routes';

import React from 'react';

/**
 * Extension for the Jira plugin that enables the customization of the annotation prefix
 * @alpha
 */
export const annotationPrefixExtensionDataRef =
  createExtensionDataRef<string>('annotationPrefix');

/**
 * @alpha
 */
export const entityJiraContent = createEntityContentExtension({
  defaultPath: '/jira',
  defaultTitle: 'Jira Dashboard',
  name: 'entity',
  inputs: {
    props: createExtensionInput(
      {
        annotationPrefix: annotationPrefixExtensionDataRef.optional(),
      },
      {
        singleton: true,
        optional: true,
      },
    ),
  },
  routeRef: convertLegacyRouteRef(rootRouteRef),
  loader: ({ inputs }) =>
    import('../components/JiraDashboardContent').then(m =>
      compatWrapper(
        <m.JiraDashboardContent
          annotationPrefix={inputs.props?.output.annotationPrefix}
        />,
      ),
    ),
});
