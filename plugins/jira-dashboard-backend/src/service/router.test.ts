import { mockServices } from '@backstage/backend-test-utils';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
import { JiraConfig } from '../config';

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const rootConfig = mockServices.rootConfig({
      data: { jiraDashboard: { instances: [] } },
    });
    const router = await createRouter({
      auth: mockServices.auth.mock(),
      logger: mockServices.logger.mock(),
      rootConfig,
      config: JiraConfig.fromConfig(rootConfig),
      discovery: mockServices.discovery.mock(),
      httpAuth: mockServices.httpAuth.mock(),
      userInfo: mockServices.userInfo.mock(),
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
