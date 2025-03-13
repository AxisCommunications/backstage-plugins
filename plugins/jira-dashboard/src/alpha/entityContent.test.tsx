import { screen, waitFor } from '@testing-library/react';
import {
  createExtensionTester,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/frontend-test-utils';
import { entityJiraContent } from './entityContent';
import { JiraDashboardApi, jiraDashboardApiRef } from '../api';
import mockedJiraResponse from '../../dev/__fixtures__/jiraResponse.json';
import mockedEntity from '../../dev/__fixtures__/entity.json';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import React from 'react';

const mockJiraApi = {
  getJiraResponseByEntity: jest.fn(() => mockedJiraResponse),
  getProjectAvatar: jest.fn(() => ({
    '48x48': 'url',
  })),
} as unknown as JiraDashboardApi;

describe('Entity content extensions', () => {
  it('should render the dashboard on an entity with the correct annotation', async () => {
    renderInTestApp(
      <TestApiProvider apis={[[jiraDashboardApiRef, mockJiraApi]]}>
        <EntityProvider entity={mockedEntity}>
          {createExtensionTester(entityJiraContent).reactElement()}
        </EntityProvider>
      </TestApiProvider>,
    );
    await waitFor(
      () => {
        expect(screen.getByTestId('project-card')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });
});
