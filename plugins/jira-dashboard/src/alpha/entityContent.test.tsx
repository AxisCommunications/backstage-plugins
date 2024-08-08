import { screen, waitFor } from '@testing-library/react';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import { entityJiraContent } from './entityContent';
import {
  createApiExtension,
  createApiFactory,
} from '@backstage/frontend-plugin-api';
import { JiraDashboardApi, jiraDashboardApiRef } from '../api';
import { Project } from '@axis-backstage/plugin-jira-dashboard-common';

const entityWithJiraAnnotations = {
  entity: {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      namespace: 'default',
      name: 'artist-web',
      description: 'The place to be, for great artists',
      annotations: {
        'jira.com/project-key': 'value',
        'jira.com/filter-ids': 12345,
      },
    },
    spec: {
      type: 'website',
      lifecycle: 'production',
      owner: 'artist-relations-team',
      system: 'artist-engagement-portal',
    },
  },
};

jest.mock('@backstage/plugin-catalog-react', () => ({
  ...jest.requireActual('@backstage/plugin-catalog-react'),
  useEntity: () => entityWithJiraAnnotations,
}));

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useRouteRef: () => () => '/jira',
}));

const mockJiraApi = {
  getJiraResponseByEntity: jest.fn(() => ({
    project: {
      name: 'project-name',
      key: 'key',
      self: 'https://your-name.atlassian.net',
    } as Project,
    data: [],
  })),
  getProjectAvatar: jest.fn(() => ({
    '48x48': 'url',
  })),
} as unknown as JiraDashboardApi;

describe('Entity content extensions', () => {
  const mockJiraApiExtension = createApiExtension({
    factory: createApiFactory({
      api: jiraDashboardApiRef,
      deps: {},
      factory: () => mockJiraApi,
    }),
  });

  it('should render the dashboard on an entity with the correct annotation', async () => {
    createExtensionTester(entityJiraContent).add(mockJiraApiExtension).render();
    await waitFor(
      () => {
        expect(screen.getByTestId('project-card')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });
});
