import { PluginEnvironment } from '../types';
import { createRouter } from '@axis-backstage/plugin-statuspage-backend';
import { Router } from 'express';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
  });
}
