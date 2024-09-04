/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  HomePageRandomJoke,
  HomePageRecentlyVisited,
  HomePageStarredEntities,
  HomePageTopVisited,
  WelcomeTitle,
} from '@backstage/plugin-home';
import { Content, Header, Page } from '@backstage/core-components';
import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { SearchBar } from '@backstage/plugin-search-react';

export const homePage = (
  <Page themeId="home">
    <Header title={<WelcomeTitle />} pageTitleOverride="Home" />
    <Content>
      <Grid container spacing={2} alignItems="flex-start">
        <Grid xs={12} display="flex" justifyContent="center">
          <SearchBar />
        </Grid>
        <Grid xs={5} container justifyContent="normal">
          <Grid lg={6} md={12}>
            <HomePageTopVisited numVisitsOpen={5} numVisitsTotal={20} />
          </Grid>
          <Grid lg={6} md={12}>
            <HomePageRecentlyVisited numVisitsOpen={5} numVisitsTotal={20} />
          </Grid>
          <Grid xs={12}>
            <HomePageStarredEntities />
          </Grid>
        </Grid>
        <Grid container xs={7}>
          <Grid xs={12}>
            <HomePageRandomJoke />
          </Grid>
        </Grid>
      </Grid>
    </Content>
  </Page>
);
