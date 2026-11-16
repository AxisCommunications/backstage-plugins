import {
  renderInTestApp,
  registerMswTestHooks,
  TestApiRegistry,
  MockFetchApi,
} from '@backstage/test-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { ApiProvider, UrlPatternDiscovery } from '@backstage/core-app-api';
import { readmeApiRef } from '../../api/ReadmeApi';
import { ReadmeClient } from '../../api/ReadmeClient';
import { ReadmeEntityContent } from './ReadmeEntityContent';
import mockedEntity from '../../../dev/__fixtures__/entity.json';
import mockedReadmeContent from '../../../dev/__fixtures__/mockedReadmeContent.json';

describe('ReadmeEntityContent', () => {
  const server = setupServer();
  registerMswTestHooks(server);

  const mockBaseUrl = 'http://localhost:7007/api/readme';
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);
  const fetchApi = new MockFetchApi();
  const identityApi = {
    getCredentials: async () => ({ token: undefined }),
  };
  let apis: TestApiRegistry;

  beforeEach(() => {
    apis = TestApiRegistry.from([
      readmeApiRef,
      new ReadmeClient({ discoveryApi, fetchApi, identityApi } as any),
    ]);
    server.use(
      http.get(`${mockBaseUrl}/:kind/:namespace/:name`, () =>
        HttpResponse.text(mockedReadmeContent[0], {
          headers: { 'Content-Type': mockedReadmeContent[1] },
        }),
      ),
    );
  });

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  it('should render the readme content of the entity', async () => {
    await renderInTestApp(
      <EntityProvider entity={mockedEntity as any}>
        <ApiProvider apis={apis}>
          <ReadmeEntityContent />
        </ApiProvider>
      </EntityProvider>,
    );

    expect(
      await screen.findByRole('heading', { name: /What is Backstage/i }),
    ).toBeInTheDocument();
  });
});
