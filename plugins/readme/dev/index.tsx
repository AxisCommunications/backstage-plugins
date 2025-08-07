import { createDevApp } from '@backstage/dev-utils';
import { readmePlugin, ReadmeCard } from '../src/plugin';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import mockEntity from './__fixtures__/entity.json';
import { Content } from '@backstage/core-components';
import { readmeApiRef } from '../src/api/ReadmeApi';
import mockedReadmeContent from './__fixtures__/mockedReadmeContent.json';
import Grid from '@mui/material/Unstable_Grid2';

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
          <Grid container>
            <Grid md={6} xs={6}>
              <ReadmeCard />
            </Grid>
          </Grid>
        </EntityProvider>
      </Content>
    ),
    title: 'Root Page',
    path: '/readme',
  })
  .render();
