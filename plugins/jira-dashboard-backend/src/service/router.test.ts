import express from 'express';
import request from 'supertest';
import { createRouter } from './router';
import { mockServices } from '@backstage/backend-test-utils';

describe('createRouter', () => {
  let app: express.Express;
  const tokenManager = mockServices.tokenManager.mock();
  const testDiscovery = mockServices.discovery.mock();
  const identity = mockServices.identity.mock();

  beforeAll(async () => {
    const router = await createRouter({
      logger: mockServices.logger.mock(),
      config: mockServices.rootConfig(),
      discovery: testDiscovery,
      identity,
      tokenManager,
      userInfo: mockServices.userInfo({ userEntityRef: 'user:default/guest' }),
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
