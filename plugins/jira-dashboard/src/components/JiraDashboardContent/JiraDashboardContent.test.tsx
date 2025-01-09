import React from 'react';
import { JiraDashboardContent } from './JiraDashboardContent';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import {
  MockConfigApi,
  MockFetchApi,
  TestApiRegistry,
  renderInTestApp,
  setupRequestMockHandlers,
} from '@backstage/test-utils';
import { JiraDashboardClient, jiraDashboardApiRef } from '../../api';
import { ApiProvider, UrlPatternDiscovery } from '@backstage/core-app-api';
import mockedJiraResponse from '../../../dev/__fixtures__/jiraResponse.json';
import mockedEntity from '../../../dev/__fixtures__/entity.json';
import { configApiRef } from '@backstage/core-plugin-api';

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
        `${mockBaseUrl}/dashboards/by-entity-ref/:kind/:namespace/:name`,
        (req, res, ctx) => {
          const { kind, namespace, name } = req.params;
          if (kind && namespace && name) {
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

  it('renders missing annotations screen if annotation is not present', async () => {
    const mockConfigApi = new MockConfigApi({
      jiraDashboard: {
        annotationPrefix: 'different-jira',
      },
    });

    const mockedConfigApis = TestApiRegistry.from(
      [configApiRef, mockConfigApi],
      [jiraDashboardApiRef, jiraClient],
    );

    const rendered = await renderInTestApp(
      <EntityProvider entity={mockedEntity}>
        <ApiProvider apis={mockedConfigApis}>
          <JiraDashboardContent />,
        </ApiProvider>
      </EntityProvider>,
    );
    expect(rendered.getByText(/Missing Annotation/)).toBeInTheDocument();
    expect(rendered.getAllByText(/different-jira/)).toHaveLength(2);
  });
});
