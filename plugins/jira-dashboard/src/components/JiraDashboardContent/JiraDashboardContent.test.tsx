import React from 'react';
import { JiraDashboardContent } from './JiraDashboardContent';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import {
  MockFetchApi,
  TestApiRegistry,
  renderInTestApp,
  setupRequestMockHandlers,
} from '@backstage/test-utils';
import { JiraDashboardClient, jiraDashboardApiRef } from '../../api';
import { ApiProvider, UrlPatternDiscovery } from '@backstage/core-app-api';
import mockedJiraResponse from '../../../dev/__fixtures__/jiraResponse.json';
import mockedEntity from '../../../dev/__fixtures__/entity.json';

describe('JiraDashboardContent', () => {
  const server = setupServer();
  setupRequestMockHandlers(server);

  const mockBaseUrl = 'http://localhost:7007/api/jira-dashboard';
  let jiraClient: JiraDashboardClient;
  let apis: TestApiRegistry;
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);
  const fetchApi = new MockFetchApi();

  const setupHandlers = () => {
    server.use(
      rest.get(
        `${mockBaseUrl}/dashboards/by-entity-ref/:entityRef`,
        (req, res, ctx) => {
          const { entityRef } = req.params;
          const projectKey =
            mockedEntity.metadata.annotations['jira.com/project-key'];
          if (entityRef && projectKey) {
            return res(ctx.json(mockedJiraResponse));
          }
          return res(ctx.status(400));
        },
      ),
    );
  };

  beforeEach(() => {
    jiraClient = new JiraDashboardClient({ discoveryApi, fetchApi });
    server.listen();
    apis = TestApiRegistry.from([jiraDashboardApiRef, jiraClient]);

    setupHandlers();
  });

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  it('renders component', async () => {
    const rendered = await renderInTestApp(
      <EntityProvider entity={mockedEntity}>
        <ApiProvider apis={apis}>
          <JiraDashboardContent />
        </ApiProvider>
      </EntityProvider>,
    );
    expect(rendered.getByText(/Jira Dashboard/)).toBeInTheDocument();
  });

  it('renders project card', async () => {
    const { getByTestId } = await renderInTestApp(
      <EntityProvider entity={mockedEntity}>
        <ApiProvider apis={apis}>
          <JiraDashboardContent />,
        </ApiProvider>
      </EntityProvider>,
    );
    expect(getByTestId('project-card')).toBeInTheDocument();
  });

  it('renders issues', async () => {
    const { getAllByTestId } = await renderInTestApp(
      <EntityProvider entity={mockedEntity}>
        <ApiProvider apis={apis}>
          <JiraDashboardContent />,
        </ApiProvider>
      </EntityProvider>,
    );
    expect(getAllByTestId('issue-table')).toHaveLength(2);
  });
});
