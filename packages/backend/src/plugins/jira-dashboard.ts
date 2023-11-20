import { createRouter } from '@axis-backstage/plugin-jira-dashboard-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    discovery: env.discovery,
    identity: env.identity,
    tokenManager: env.tokenManager,
  });
}
