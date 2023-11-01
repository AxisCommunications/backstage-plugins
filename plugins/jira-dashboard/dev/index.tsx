import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { EntityJiraDashboardContent, jiraDashboardPlugin } from '../src';

createDevApp()
  .registerPlugin(jiraDashboardPlugin)
  .addPage({
    element: <EntityJiraDashboardContent />,
    title: 'Root Page',
    path: '/jira-dashboard',
  })
  .render();
