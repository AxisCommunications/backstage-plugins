import { createApp } from '@backstage/frontend-defaults';
import { PageBlueprint } from '@backstage/frontend-plugin-api';
import { microsoftAuthApiRef } from '@backstage/core-plugin-api';
import type { SignInProviderConfig } from '@backstage/core-components';
import { SignInPage } from '@backstage/core-components';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';
import type { SignInPageProps } from '@backstage/plugin-app-react';
import appPlugin from '@backstage/plugin-app';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import catalogImportPlugin from '@backstage/plugin-catalog-import/alpha';
import userSettingsPlugin from '@backstage/plugin-user-settings/alpha';
import readmePlugin from '@axis-backstage/plugin-readme/alpha';
import { Navigate } from 'react-router';
// if app.packages is not set in the app config, could manually add features like this
// See documentation for details: https://backstage.io/docs/frontend-system/architecture/app#feature-discovery
// import jiraPlugin from '@axis-backstage/plugin-jira-dashboard/alpha';

const microsoftProvider: SignInProviderConfig = {
  id: 'microsoft-auth-provider',
  title: 'Microsoft',
  message: 'Sign in using Microsoft',
  apiRef: microsoftAuthApiRef,
};

function CustomSignInPage(props: SignInPageProps) {
  return (
    <SignInPage
      {...props}
      providers={['guest', microsoftProvider]}
      title="Select a sign-in method"
      align="center"
    />
  );
}

const signInPageExtension = SignInPageBlueprint.make({
  params: {
    loader: async () => CustomSignInPage,
  },
});

const homePageExtension = PageBlueprint.make({
  name: 'homePage',
  params: {
    path: '/',
    loader: () => Promise.resolve(<Navigate to="catalog" />),
  },
});

const appOverride = appPlugin.withOverrides({
  extensions: [homePageExtension, signInPageExtension],
});

const app = createApp({
  features: [
    appOverride,
    catalogPlugin,
    catalogImportPlugin,
    userSettingsPlugin,
    readmePlugin,
  ],
});

export default app.createRoot();
