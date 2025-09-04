import { createApp } from '@backstage/frontend-defaults';
import {
  createFrontendModule,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import catalogImportPlugin from '@backstage/plugin-catalog-import/alpha';
import userSettingsPlugin from '@backstage/plugin-user-settings/alpha';
import { Navigate } from 'react-router';
// if app.packages is not set in the app config, could manually add features like this
// See documentation for details: https://backstage.io/docs/frontend-system/architecture/app#feature-discovery
// import jiraPlugin from '@axis-backstage/plugin-jira-dashboard/alpha';

const homePageExtension = PageBlueprint.make({
  name: 'homePage',
  params: {
    path: '/',
    loader: () => Promise.resolve(<Navigate to="catalog" />),
  },
});

export const app = createApp({
  features: [
    catalogPlugin,
    catalogImportPlugin,
    userSettingsPlugin,
    createFrontendModule({
      pluginId: 'app',
      extensions: [homePageExtension],
    }),
  ],
});

export default app.createRoot();
