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
  discoveryApiRef,
  fetchApiRef,
  microsoftAuthApiRef,
} from '@backstage/core-plugin-api';
import { UmamiAnalytics } from '@axis-backstage/plugin-analytics-module-umami';
import {
  StatuspageClient,
  statuspageApiRef,
} from '@axis-backstage/plugin-statuspage';
import {
  vacationCalendarApiRef,
  VacationCalendarApiClient,
} from '@axis-backstage/plugin-vacation-calendar';

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
  createApiFactory({
    api: statuspageApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      fetchApi: fetchApiRef,
    },
    factory: ({ discoveryApi, fetchApi }) =>
      new StatuspageClient({ discoveryApi, fetchApi }),
  }),
  createApiFactory({
    api: vacationCalendarApiRef,
    deps: {
      authApi: microsoftAuthApiRef,
      fetchApi: fetchApiRef,
    },
    factory: ({ authApi, fetchApi }) =>
      new VacationCalendarApiClient({ authApi, fetchApi }),
  }),
  ScmAuth.createDefaultApiFactory(),
];
