import { mockServices } from '@backstage/backend-test-utils';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { CATALOG_FILTER_EXISTS } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { DefaultReadmeCollatorFactory } from './DefaultReadmeCollatorFactory';

const entityWithSourceLocation: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'my-service',
    namespace: 'default',
    title: 'My Service',
    annotations: {
      'backstage.io/source-location':
        'url:https://github.com/org/repo/blob/main/catalog-info.yaml',
    },
  },
  spec: { owner: 'guest' },
};

const entityWithoutReadme: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'no-readme',
    namespace: 'default',
    annotations: {
      'backstage.io/source-location':
        'url:https://github.com/org/repo/blob/main/catalog-info.yaml',
    },
  },
  spec: { owner: 'guest' },
};

const entityFailing: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'failing',
    namespace: 'default',
    annotations: {
      'backstage.io/source-location':
        'url:https://github.com/org/repo/blob/main/catalog-info.yaml',
    },
  },
  spec: { owner: 'guest' },
};

const entityWithoutUrlSource: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'no-url-source',
    namespace: 'default',
    annotations: {},
  },
  spec: { owner: 'guest' },
};

const markdownContent = `# My Service

A service that does things. See [the docs](https://example.com/docs) for more info.

\`\`\`bash
echo 'hidden code block'
\`\`\`

- **Bold** item
`;

describe('DefaultReadmeCollatorFactory', () => {
  const auth = mockServices.auth.mock({
    getPluginRequestToken: async () => ({ token: 'mock-service-token' }),
  });
  const discovery = mockServices.discovery.mock({
    getBaseUrl: async () => 'http://readme.api',
  });
  const logger = mockServices.rootLogger();
  const catalog = catalogServiceMock.mock({
    queryEntities: async () => ({
      items: [
        entityWithSourceLocation,
        entityWithoutReadme,
        entityFailing,
        entityWithoutUrlSource,
      ],
      pageInfo: { nextCursor: undefined },
      totalItems: 4,
    }),
  });

  const fetchMock = jest.spyOn(global, 'fetch');

  beforeEach(() => {
    (catalog.queryEntities as jest.Mock).mockClear();
    fetchMock.mockReset();
    fetchMock.mockImplementation(async (input: any) => {
      const url = String(input).toLowerCase();
      if (url.includes('component/default/my-service')) {
        return new Response(markdownContent, {
          status: 200,
          headers: { 'Content-Type': 'text/markdown' },
        });
      }
      if (url.includes('component/default/no-readme')) {
        return new Response('Not found', { status: 404 });
      }
      if (url.includes('component/default/failing')) {
        return new Response('Internal error', { status: 500 });
      }
      return new Response('Not found', { status: 404 });
    });
  });

  afterAll(() => {
    fetchMock.mockRestore();
  });

  it('has type readme', async () => {
    const factory = DefaultReadmeCollatorFactory.fromConfig(
      mockServices.rootConfig(),
      { auth, catalog, discovery, logger },
    );
    expect(factory.type).toBe('readme');
  });

  it('yields documents for entities with a README, stripping markdown', async () => {
    const factory = DefaultReadmeCollatorFactory.fromConfig(
      mockServices.rootConfig(),
      { auth, catalog, discovery, logger },
    );

    const docs: any[] = [];
    for await (const doc of await factory.getCollator()) {
      docs.push(doc);
    }

    expect(docs).toHaveLength(1);
    expect(docs[0]).toEqual({
      title: 'My Service - README',
      text: 'My Service A service that does things. See the docs for more info. Bold item',
      location: '/catalog/default/component/my-service',
      entityRef: 'component:default/my-service',
      kind: 'Component',
      namespace: 'default',
      name: 'my-service',
    });
  });

  it('skips entities whose README is not found and entities that fail', async () => {
    const factory = DefaultReadmeCollatorFactory.fromConfig(
      mockServices.rootConfig(),
      { auth, catalog, discovery, logger },
    );

    const docs: any[] = [];
    for await (const doc of await factory.getCollator()) {
      docs.push(doc);
    }

    expect(docs.map((d: any) => d.name)).toEqual(['my-service']);
  });

  it('does not fetch README for entities without a URL source location', async () => {
    const factory = DefaultReadmeCollatorFactory.fromConfig(
      mockServices.rootConfig(),
      { auth, catalog, discovery, logger },
    );

    for await (const _ of await factory.getCollator()) {
      // drain
    }

    const requestedUrls = fetchMock.mock.calls.map(([input]) => String(input));
    expect(requestedUrls).not.toContainEqual(
      expect.stringContaining('component/default/no-url-source'),
    );
  });

  it('passes the service token to the readme backend', async () => {
    const factory = DefaultReadmeCollatorFactory.fromConfig(
      mockServices.rootConfig(),
      { auth, catalog, discovery, logger },
    );

    for await (const _ of await factory.getCollator()) {
      // drain
    }

    const myServiceCalls = fetchMock.mock.calls.filter(([input]) =>
      String(input).toLowerCase().includes('component/default/my-service'),
    );
    expect(myServiceCalls).not.toHaveLength(0);
    for (const call of myServiceCalls) {
      expect((call[1] as any).headers.Authorization).toContain('Bearer ');
    }
  });

  it('applies a custom location template', async () => {
    const factory = DefaultReadmeCollatorFactory.fromConfig(
      mockServices.rootConfig({
        data: {
          search: {
            collators: {
              readme: { locationTemplate: '/catalog/:kind/:namespace/:name' },
            },
          },
        },
      }),
      { auth, catalog, discovery, logger },
    );

    const docs: any[] = [];
    for await (const doc of await factory.getCollator()) {
      docs.push(doc);
    }

    expect(docs[0].location).toBe('/catalog/component/default/my-service');
  });

  it('respects the catalog filter option', async () => {
    const factory = DefaultReadmeCollatorFactory.fromConfig(
      mockServices.rootConfig({
        data: {
          search: {
            collators: {
              readme: { filter: { kind: ['API'] } },
            },
          },
        },
      }),
      { auth, catalog, discovery, logger },
    );

    for await (const _ of await factory.getCollator()) {
      // drain
    }

    const initialRequest = (catalog.queryEntities as jest.Mock).mock
      .calls[0][0];
    expect(initialRequest.filter.kind).toEqual(['API']);
    expect(
      initialRequest.filter[
        'metadata.annotations.backstage.io/source-location'
      ],
    ).toEqual(CATALOG_FILTER_EXISTS);
  });
});
