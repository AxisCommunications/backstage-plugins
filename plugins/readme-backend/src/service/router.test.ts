import {
  getVoidLogger,
  HostDiscovery,
  ServerTokenManager,
  UrlReaders,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const config = new ConfigReader({
      backend: {
        baseUrl: 'http://127.0.0.1:7007',
        auth: {
          keys: [{ secret: 'abcd' }],
        },
      },
    });
    const logger = getVoidLogger();
    const discovery = HostDiscovery.fromConfig(config);
    const tokenManager = ServerTokenManager.fromConfig(config, {
      logger,
    });
    const reader = UrlReaders.default({ logger, config });

    const router = await createRouter({
      logger: getVoidLogger(),
      config,
      discovery,
      tokenManager,
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
