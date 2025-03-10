import React from 'react';
import { createApp } from '@backstage/frontend-defaults';
import {
  configApiRef,
  ApiBlueprint,
  createApiFactory,
  createFrontendModule,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import {
  ScmAuth,
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import catalogImportPlugin from '@backstage/plugin-catalog-import/alpha';
import userSettingsPlugin from '@backstage/plugin-user-settings/alpha';
import { Navigate } from 'react-router';
// if app.experimental is not set in the app config, could manually add features like this
// See documentation for details: https://backstage.io/docs/frontend-system/architecture/app#feature-discovery
// import jiraPlugin from '@axis-backstage/plugin-jira-dashboard/alpha';

const homePageExtension = PageBlueprint.make({
  name: 'homePage',
  params: {
    defaultPath: '/',
    loader: () => Promise.resolve(<Navigate to="catalog" />),
  },
});

const scmAuthApi = ApiBlueprint.make({
  name: 'scm-auth',
  params: {
    factory: ScmAuth.createDefaultApiFactory(),
  },
});

const scmIntegrationsApi = ApiBlueprint.make({
  name: 'scm-integrations',
  params: {
    factory: createApiFactory({
      api: scmIntegrationsApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
    }),
  },
});

export const app = createApp({
  features: [
    catalogPlugin,
    catalogImportPlugin,
    userSettingsPlugin,
    // jiraPlugin,
    createFrontendModule({
      pluginId: 'app',
      extensions: [homePageExtension, scmAuthApi, scmIntegrationsApi],
    }),
  ],
});

export default app.createRoot();
