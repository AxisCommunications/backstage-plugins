import { mockServices, mockCredentials } from '@backstage/backend-test-utils';
import { NotFoundError } from '@backstage/errors';
import { createGetReadmeContentAction } from './getReadmeContentAction';

describe('createGetReadmeContentAction', () => {
  const actionsRegistry = { register: jest.fn() };
  const auth = mockServices.auth.mock({
    getPluginRequestToken: async () => ({ token: 'mock-token' }),
  });
  const discovery = mockServices.discovery.mock({
    getBaseUrl: async () => 'http://readme.api',
  });
  const logger = mockServices.rootLogger();
  const fetchMock = jest.spyOn(global, 'fetch');

  const registeredAction = () => actionsRegistry.register.mock.calls[0][0];

  beforeEach(() => {
    actionsRegistry.register.mockClear();
    fetchMock.mockReset();
    createGetReadmeContentAction({
      actionsRegistry: actionsRegistry as any,
      auth,
      discovery,
      logger,
    });
  });

  afterAll(() => {
    fetchMock.mockRestore();
  });

  it('registers the action', () => {
    expect(actionsRegistry.register).toHaveBeenCalledTimes(1);
    const action = registeredAction();
    expect(action.name).toBe('get-readme-content');
    expect(action.title).toBe('Get README Content');
    expect(action.attributes).toEqual({
      readOnly: true,
      idempotent: true,
      destructive: false,
    });
  });

  it('returns the README content for an entity', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response('# My README', {
        status: 200,
        headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
      }),
    );

    const result = await registeredAction().action({
      input: { entityRef: 'component:default/my-service' },
      credentials: mockCredentials.user(),
      logger,
    });

    expect(result).toEqual({
      output: {
        entityRef: 'component:default/my-service',
        content: '# My README',
        contentType: 'text/markdown',
      },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://readme.api/component/default/my-service',
      { headers: { Authorization: 'Bearer mock-token' } },
    );
  });

  it('normalizes entity references that omit kind and namespace', async () => {
    fetchMock.mockResolvedValueOnce(new Response('readme', { status: 200 }));

    const result = await registeredAction().action({
      input: { entityRef: 'my-service' },
      credentials: mockCredentials.user(),
      logger,
    });

    expect(result.output.entityRef).toBe('component:default/my-service');
    expect(String(fetchMock.mock.calls[0][0])).toBe(
      'http://readme.api/component/default/my-service',
    );
  });

  it('throws a NotFoundError when the entity has no README', async () => {
    fetchMock.mockResolvedValueOnce(new Response('Not found', { status: 404 }));

    await expect(
      registeredAction().action({
        input: { entityRef: 'component:default/my-service' },
        credentials: mockCredentials.user(),
        logger,
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws when the readme backend fails', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response('Internal error', { status: 500 }),
    );

    await expect(
      registeredAction().action({
        input: { entityRef: 'component:default/my-service' },
        credentials: mockCredentials.user(),
        logger,
      }),
    ).rejects.toThrow('responded with status 500');
  });

  it('requests a token on behalf of the caller', async () => {
    fetchMock.mockResolvedValueOnce(new Response('readme', { status: 200 }));

    const credentials = mockCredentials.user();
    await registeredAction().action({
      input: { entityRef: 'component:default/my-service' },
      credentials,
      logger,
    });

    expect(auth.getPluginRequestToken).toHaveBeenCalledWith(
      expect.objectContaining({
        onBehalfOf: credentials,
        targetPluginId: 'readme',
      }),
    );
  });
});
