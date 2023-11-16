import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { readmePlugin, ReadmeCard } from '../src/plugin';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import mockEntity from './__fixtures__/entity.json';
import { Content } from '@backstage/core-components';
import { readmeApiRef } from '../src/api/ReadmeApi';
import mockedReadmeContent from './__fixtures__/mockedReadmeContent.md';

createDevApp()
  .registerPlugin(readmePlugin)
  .registerApi({
    api: readmeApiRef,
    deps: {},
    factory: () =>
      ({
        getReadmeContent: async () => mockedReadmeContent,
      } as any),
  })
  .addPage({
    element: (
      <Content>
        <EntityProvider entity={mockEntity}>
          <ReadmeCard />
        </EntityProvider>
      </Content>
    ),
    title: 'Root Page',
    path: '/readme',
  })
  .render();
