import { EntityJiraDashboardContent, jiraDashboardPlugin } from '../src';
import { jiraDashboardApiRef } from '../src/api';
import mockEntity from './__fixtures__/entity.json';
import mockJiraResponse from './__fixtures__/jiraResponse.json';
import { Page, Content } from '@backstage/core-components';
import { createDevApp } from '@backstage/dev-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import React from 'react';

/* Use to test with Jira Cloud

import mockJiraCloudResponse from './__fixtures__/jiraCloudResponse.json'; 
*/

createDevApp()
  .registerPlugin(jiraDashboardPlugin)
  .registerApi({
    api: jiraDashboardApiRef,
    deps: {},
    factory: () =>
      ({
        getJiraResponseByEntity: async () => mockJiraResponse,
        getProjectAvatar: async () => mockJiraResponse,
      } as any),
  })
  .addPage({
    element: (
      <Page themeId="home">
        <Content>
          <EntityProvider entity={mockEntity}>
            <EntityJiraDashboardContent />
          </EntityProvider>
        </Content>
      </Page>
    ),
    title: 'Root Page',
    path: '/jira-dashboard',
  })
  .render();
