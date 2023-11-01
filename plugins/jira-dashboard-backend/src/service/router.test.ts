import {
  PluginEndpointDiscovery,
  ServerTokenManager,
  getVoidLogger,
} from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';
import { createRouter } from './router';
import {
  BackstageIdentityResponse,
  IdentityApiGetIdentityRequest,
} from '@backstage/plugin-auth-node';
import { ConfigReader } from '@backstage/config';

const testDiscovery: jest.Mocked<PluginEndpointDiscovery> = {
  getBaseUrl: jest
    .fn()
    .mockResolvedValue('http://localhost:7007/api/jira-dashboard'),
  getExternalBaseUrl: jest.fn(),
};

describe('createRouter', () => {
  let app: express.Express;
  const tokenManager = ServerTokenManager.noop();

  const getIdentity = jest
    .fn()
    .mockImplementation(
      async ({
        request: _request,
      }: IdentityApiGetIdentityRequest): Promise<
        BackstageIdentityResponse | undefined
      > => {
        return {
          identity: {
            userEntityRef: 'user:default/guest',
            ownershipEntityRefs: [],
            type: 'user',
          },
          token: 'token',
        };
      },
    );

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      config: new ConfigReader({}),
      discovery: testDiscovery,
      identity: { getIdentity },
      tokenManager,
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
