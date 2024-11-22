import { mockServices } from '@backstage/backend-test-utils';
import { UrlReaders } from '@backstage/backend-defaults/urlReader';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const config = mockServices.rootConfig();
    const logger = mockServices.rootLogger.mock();
    const discovery = mockServices.discovery.mock();
    const reader = UrlReaders.default({ logger, config });

    const router = await createRouter({
      auth: mockServices.auth.mock(),
      logger,
      config,
      discovery,
      reader,
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
