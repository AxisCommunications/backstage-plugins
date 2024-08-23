import {
  createServiceBuilder,
  loadBackendConfig,
  HostDiscovery,
  ServerTokenManager,
} from '@backstage/backend-common';
import { LoggerService } from '@backstage/backend-plugin-api';
import { UrlReaders } from '@backstage/backend-defaults/urlReader';
import { Server } from 'http';
import { createRouter } from './router';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: LoggerService;
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
