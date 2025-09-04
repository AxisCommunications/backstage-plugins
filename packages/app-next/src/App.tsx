import { createApp } from '@backstage/frontend-defaults';
import {
  configApiRef,
  ApiBlueprint,
  createFrontendModule,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import {
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
    path: '/',
    loader: () => Promise.resolve(<Navigate to="catalog" />),
  },
});

const scmIntegrationsApi = ApiBlueprint.make({
  name: 'scm-integrations',
  params: defineParams =>
    defineParams({
      api: scmIntegrationsApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
    }),
});

export const app = createApp({
  features: [
    catalogPlugin,
    catalogImportPlugin,
    userSettingsPlugin,
    // jiraPlugin,
    createFrontendModule({
      pluginId: 'app',
      extensions: [homePageExtension, scmIntegrationsApi],
    }),
  ],
});

export default app.createRoot();
