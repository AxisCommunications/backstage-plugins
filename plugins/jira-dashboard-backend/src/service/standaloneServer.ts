import {
  HostDiscovery,
  ServerTokenManager,
  createServiceBuilder,
  loadBackendConfig,
} from '@backstage/backend-common';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Server } from 'http';
import { createRouter } from './router';
import { IdentityApi } from '@backstage/plugin-auth-node';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: LoggerService;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'jira-dashboard-backend' });
  const config = await loadBackendConfig({ logger, argv: process.argv });
  const tokenManager = ServerTokenManager.noop();
  logger.debug('Starting application server...');
  const router = await createRouter({
    logger,
    config: config,
    discovery: HostDiscovery.fromConfig(config),
    identity: {} as IdentityApi,
    tokenManager,
  });

  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/jira-dashboard', router);
  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }

  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
