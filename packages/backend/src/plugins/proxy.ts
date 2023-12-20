import { PluginEnvironment } from '../types';
import { createRouter } from '@backstage/plugin-proxy-backend';
import { Router } from 'express';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    discovery: env.discovery,
  });
}
