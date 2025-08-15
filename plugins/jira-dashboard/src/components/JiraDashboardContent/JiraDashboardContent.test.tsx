import { JiraDashboardContent } from './JiraDashboardContent';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import {
  MockFetchApi,
  TestApiRegistry,
  renderInTestApp,
  registerMswTestHooks,
} from '@backstage/test-utils';
import { JiraDashboardClient, jiraDashboardApiRef } from '../../api';
import { ApiProvider, UrlPatternDiscovery } from '@backstage/core-app-api';
import mockedJiraResponse from '../../../dev/__fixtures__/jiraResponse.json';
import mockedEntity from '../../../dev/__fixtures__/entity.json';
import singleProjectResponse from '../../../dev/__fixtures__/singleProjectResponse.json';
import { fireEvent, waitFor } from '@testing-library/react';

describe('JiraDashboardContent', () => {
  const server = setupServer();
  registerMswTestHooks(server);

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
});
describe('JiraDashboardContent - Single Project View', () => {
  const server = setupServer();
  registerMswTestHooks(server);

  const mockBaseUrl = 'http://localhost:7007/api/jira-dashboard';
  let jiraClient: JiraDashboardClient;
  let apis: TestApiRegistry;
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);
  const fetchApi = new MockFetchApi();

  const setupHandlers = () => {
    server.use(
      rest.get(
        `${mockBaseUrl}/dashboards/by-entity-ref/:kind/:namespace/:name`,
        (_req, res, ctx) => {
          return res(ctx.json(singleProjectResponse));
        },
      ),
    );
  };

  beforeEach(() => {
    jiraClient = new JiraDashboardClient({ discoveryApi, fetchApi });
    apis = TestApiRegistry.from([jiraDashboardApiRef, jiraClient]);
    setupHandlers();
  });

  it('renders project card for single project', async () => {
    const { getByTestId } = await renderInTestApp(
      <EntityProvider entity={mockedEntity}>
        <ApiProvider apis={apis}>
          <JiraDashboardContent />
        </ApiProvider>
      </EntityProvider>,
    );

    expect(getByTestId('project-card')).toBeInTheDocument();
  });

  it('renders issue tables for single project', async () => {
    const { getAllByTestId } = await renderInTestApp(
      <EntityProvider entity={mockedEntity}>
        <ApiProvider apis={apis}>
          <JiraDashboardContent />
        </ApiProvider>
      </EntityProvider>,
    );

    expect(getAllByTestId('issue-table')).toHaveLength(2); // Matches 2 filters in the JSON
  });
});
describe('JiraDashboardContent - Multi-project response', () => {
  const server = setupServer();
  registerMswTestHooks(server);

  const mockBaseUrl = 'http://localhost:7007/api/jira-dashboard';
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);
  const fetchApi = new MockFetchApi();
  let jiraClient: JiraDashboardClient;
  let apis: TestApiRegistry;

  const renderComponent = async () =>
    await renderInTestApp(
      <EntityProvider entity={mockedEntity}>
        <ApiProvider apis={apis}>
          <JiraDashboardContent />
        </ApiProvider>
      </EntityProvider>,
    );

  beforeEach(() => {
    server.use(
      rest.get(
        `${mockBaseUrl}/dashboards/by-entity-ref/:kind/:namespace/:name`,
        (_req, res, ctx) => res(ctx.json(mockedJiraResponse)),
      ),
    );
    jiraClient = new JiraDashboardClient({ discoveryApi, fetchApi });
    apis = TestApiRegistry.from([jiraDashboardApiRef, jiraClient]);
  });

  it('renders the dashboard title', async () => {
    const { getByText } = await renderComponent();
    expect(getByText(/Jira Dashboard/i)).toBeInTheDocument();
  });

  it('renders 1 project card and 2 tables per tab', async () => {
    const { getAllByTestId, getAllByRole } = await renderComponent();

    const tabs = getAllByRole('tab');
    expect(tabs).toHaveLength(2);

    for (const tab of tabs) {
      fireEvent.click(tab);
      await waitFor(() => {
        expect(getAllByTestId('project-card')).toHaveLength(1);
        expect(getAllByTestId('issue-table')).toHaveLength(2);
      });
    }
  });

  it('renders total of 2 tabs (for 2 projects)', async () => {
    const { getAllByRole } = await renderComponent();
    const tabs = getAllByRole('tab');
    expect(tabs).toHaveLength(2);
  });
});
