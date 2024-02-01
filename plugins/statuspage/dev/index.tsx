import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { statuspagePlugin, StatuspagePage } from '../src/plugin';

createDevApp()
  .registerPlugin(statuspagePlugin)
  .addPage({
    element: <StatuspagePage name="rndtools" />,
    title: 'Root Page',
    path: '/statuspage',
  })
  .render();
