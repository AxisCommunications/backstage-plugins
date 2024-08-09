import { screen, waitFor } from '@testing-library/react';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import { entityJiraContent } from './entityContent';
import {
  createApiExtension,
  createApiFactory,
} from '@backstage/frontend-plugin-api';
import { JiraDashboardApi, jiraDashboardApiRef } from '../api';
import mockedJiraResponse from '../../dev/__fixtures__/jiraResponse.json';
import mockedEntity from '../../dev/__fixtures__/entity.json';

const entityWithJiraAnnotations = {
  entity: mockedEntity,
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
  getJiraResponseByEntity: jest.fn(() => mockedJiraResponse),
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
