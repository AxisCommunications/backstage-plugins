import {
  analyticsApiRef,
  configApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { createDevApp } from '@backstage/dev-utils';
import React from 'react';

import { UmamiAnalytics } from '../src';
import { Playground } from './Playground';

createDevApp()
  .registerApi({
    api: analyticsApiRef,
    deps: { configApi: configApiRef, fetchApi: fetchApiRef },
    factory: ({ configApi, fetchApi }) =>
      UmamiAnalytics.fromConfig(configApi, {
        fetchApi,
      }),
  })
  .addPage({
    path: '/analytics-module-umami',
    title: 'Umami Playground',
    element: <Playground />,
  })
  .render();
