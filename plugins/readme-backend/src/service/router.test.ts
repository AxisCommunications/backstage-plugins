import { mockServices } from '@backstage/backend-test-utils';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';

import express from 'express';
import request from 'supertest';

import { createRouter } from './router';

describe('createRouter', () => {
  let app: express.Express;
  const catalogApi = catalogServiceMock.mock();

  beforeAll(async () => {
    const auth = mockServices.auth.mock();
    const config = mockServices.rootConfig();
    const logger = mockServices.rootLogger.mock();
    const cache = mockServices.cache.mock();
    const reader = mockServices.urlReader.mock();

    const router = await createRouter({
      auth,
      catalogApi,
      logger,
      config,
      reader,
      cache,
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
