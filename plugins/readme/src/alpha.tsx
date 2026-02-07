/**
 * Frontend plugin that fetches and displays the readme for an entity
 *
 * @packageDocumentation
 */

// @ts-ignore - React is needed for JSX
import React from 'react';
import {
  ApiBlueprint,
  createFrontendPlugin,
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
  type FrontendFeature,
} from '@backstage/frontend-plugin-api';
import { readmeApiRef } from './api/ReadmeApi';
import { ReadmeClient } from './api/ReadmeClient';
import { EntityCardBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { SearchResultListItemBlueprint } from '@backstage/plugin-search-react/alpha';
import DescriptionIcon from '@mui/icons-material/Description';

const readmeApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: readmeApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
        identityApi: identityApiRef,
      },
      factory: ({ discoveryApi, fetchApi, identityApi }) =>
        new ReadmeClient({ discoveryApi, fetchApi, identityApi }),
    }),
});

const readmeCard = EntityCardBlueprint.make({
  params: {
    loader: async () =>
      import('./components/ReadmeCard').then(m => <m.ReadmeCard />),
  },
});

/**
 * Search result list item extension for README search results
 * @alpha
 */
const readmeSearchResultListItem = SearchResultListItemBlueprint.make({
  params: {
    predicate: result => result.type === 'readme',
    component: async () => {
      const { ReadmeSearchResultListItem } = await import(
        './components/ReadmeSearchResultListItem'
      );
      return props => <ReadmeSearchResultListItem {...props} />;
    },
    icon: <DescriptionIcon />,
  },
});

/**
 * Readme plugin instance
 * @alpha
 */
const plugin: FrontendFeature = createFrontendPlugin({
  pluginId: 'readme',
  extensions: [readmeApi, readmeCard, readmeSearchResultListItem],
});

export default plugin;
