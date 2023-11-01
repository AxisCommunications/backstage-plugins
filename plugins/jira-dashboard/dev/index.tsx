import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { jiraDashboardPlugin, JiraDashboardPage } from '../src/plugin';

createDevApp()
  .registerPlugin(jiraDashboardPlugin)
  .addPage({
    element: <JiraDashboardPage />,
    title: 'Root Page',
    path: '/jira-dashboard'
  })
  .render();
