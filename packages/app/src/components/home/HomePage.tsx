import {
  HomePageRandomJoke,
  HomePageRecentlyVisited,
  HomePageStarredEntities,
  HomePageTopVisited,
  WelcomeTitle,
} from '@backstage/plugin-home';
import { Content, Header, Page } from '@backstage/core-components';
import Grid from '@mui/material/Unstable_Grid2';
import {
  SearchBar,
  SearchContextProvider,
} from '@backstage/plugin-search-react';

import { JiraUserIssuesViewCard } from '@axis-backstage/plugin-jira-dashboard';

export const homePage = (
  <SearchContextProvider>
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
            <Grid xs={12}>
              <JiraUserIssuesViewCard
                bottomLinkProps={{
                  link: 'https://our-jira-server/issues',
                  title: 'Open in Jira',
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Content>
    </Page>
  </SearchContextProvider>
);
