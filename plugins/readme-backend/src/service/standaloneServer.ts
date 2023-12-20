import { createRouter } from './router';
import {
  createServiceBuilder,
  loadBackendConfig,
  HostDiscovery,
  ServerTokenManager,
  UrlReaders,
} from '@backstage/backend-common';
import { Server } from 'http';
import { Logger } from 'winston';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'readme-backend' });
  logger.debug('Starting application server...');
  const config = await loadBackendConfig({ logger, argv: process.argv });
  const discovery = HostDiscovery.fromConfig(config);
  const reader = UrlReaders.default({ logger, config });
  const tokenManager = ServerTokenManager.fromConfig(config, {
    logger,
  });
  const router = await createRouter({
    logger,
    config,
    discovery,
    tokenManager,
    reader,
  });

  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/readme', router);
  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }

  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
