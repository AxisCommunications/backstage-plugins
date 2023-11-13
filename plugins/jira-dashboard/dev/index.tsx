import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { EntityJiraDashboardContent, jiraDashboardPlugin } from '../src';
import { jiraDashboardApiRef } from '../src/api';
import { Page, Content } from '@backstage/core-components';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import mockEntity from './__fixtures__/entity.json';
import mockJiraResponse from './__fixtures__/jiraResponse.json';

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
