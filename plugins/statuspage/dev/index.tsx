import { createDevApp } from '@backstage/dev-utils';
import { statuspagePlugin, StatuspagePage } from '../src/plugin';
import { statuspageApiRef } from '../src/api/StatuspageApi';
import mockGetComponents from './__fixtures__/mockGetComponents.json';
import mockGetComponentGroups from './__fixtures__/mockGetComponentGroups.json';

createDevApp()
  .registerPlugin(statuspagePlugin)
  .registerApi({
    api: statuspageApiRef,
    deps: {},
    factory: () =>
      ({
        getComponents: async () => mockGetComponents,
        getComponentGroups: async () => mockGetComponentGroups,
        getLink: async () => ({ url: 'https://example.statuspage.io' }),
      } as any),
  })
  .addPage({
    element: <StatuspagePage name="your-instance-name" />,
    title: 'Root Page',
    path: '/statuspage',
  })
  .render();
