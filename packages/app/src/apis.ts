import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  analyticsApiRef,
  configApiRef,
  createApiFactory,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { UmamiAnalytics } from '@axis-backstage/plugin-analytics-module-umami';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  createApiFactory({
    api: analyticsApiRef,
    deps: {
      configApi: configApiRef,
      fetchApi: fetchApiRef,
    },
    factory: ({ configApi, fetchApi }) =>
      UmamiAnalytics.fromConfig(configApi, { fetchApi }),
  }),
  ScmAuth.createDefaultApiFactory(),
];
