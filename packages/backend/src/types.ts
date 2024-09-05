import { Logger } from 'winston';
import { Config } from '@backstage/config';
import {
  PluginCacheManager,
  PluginDatabaseManager,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import {
  UrlReaderService,
  SchedulerService,
  TokenManagerService,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import { IdentityApi } from '@backstage/plugin-auth-node';

export type PluginEnvironment = {
  logger: Logger;
  database: PluginDatabaseManager;
  cache: PluginCacheManager;
  config: Config;
  reader: UrlReaderService;
  discovery: PluginEndpointDiscovery;
  tokenManager: TokenManagerService;
  scheduler: SchedulerService;
  permissions: PermissionEvaluator;
  identity: IdentityApi;
  userInfo: UserInfoService;
};
