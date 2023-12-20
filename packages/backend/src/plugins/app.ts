import { PluginEnvironment } from '../types';
import { createRouter } from '@backstage/plugin-app-backend';
import { Router } from 'express';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    appPackageName: 'app',
  });
}
