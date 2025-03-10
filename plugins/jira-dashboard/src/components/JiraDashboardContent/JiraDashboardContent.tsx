import {
  Content,
  ContentHeader,
  Progress,
  ResponseErrorPanel,
  SupportButton,
  TableFilter,
} from '@backstage/core-components';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import React from 'react';
import { JiraProjectCard } from '../JiraProjectCard';
import { JiraTable } from '../JiraTable';
import { useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { jiraDashboardApiRef } from '../../api';
import { useJira } from '../../hooks/useJira';
import { JiraDataResponse } from '@axis-backstage/plugin-jira-dashboard-common';

export const JiraDashboardContent = (props?: {
  showFilters?: TableFilter[] | boolean;
}) => {
  const { entity } = useEntity();
  const api = useApi(jiraDashboardApiRef);

  const {
    data: jiraResponse,
    loading,
    error,
  } = useJira(stringifyEntityRef(entity), api);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  } else if (!jiraResponse || !jiraResponse.data || !jiraResponse.project) {
    return (
      <ResponseErrorPanel
        error={Error(
          'Could not fetch Jira Dashboard content for defined project key',
        )}
      />
    );
  }

  return (
    <Content>
      <ContentHeader title="Jira Dashboard">
        <SupportButton>
          <Box>
            <Typography variant="h6">How it works</Typography>
            The Jira Dashboard plugin provides quickly access to Jira issue
            summaries. You can add Jira components and filters of your choice by
            defining annotations to your entity's catalog-info.yaml file.
            <Typography mt={1} variant="h6">
              Documentation
            </Typography>
            You find the documentation{' '}
            <Link href="https://github.com/AxisCommunications/backstage-plugins/tree/main/plugins/jira-dashboard">
              here.
            </Link>
          </Box>
        </SupportButton>
      </ContentHeader>
      <Grid container spacing={3}>
        {jiraResponse && jiraResponse.data && (
          <>
            <Grid md={6} xs={12} data-testid="project-card">
              <JiraProjectCard project={jiraResponse.project} />
            </Grid>
            {jiraResponse.data.map((value: JiraDataResponse) => (
              <Grid data-testid="issue-table" key={value.name} md={6} xs={12}>
                <JiraTable
                  tableContent={value}
                  showFilters={props?.showFilters}
                  project={jiraResponse.project}
                  tableStyle={{
                    height: 'max-content',
                    maxHeight: '500px',
                    padding: '20px',
                    overflowY: 'auto',
                    width: '100%',
                  }}
                />
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </Content>
  );
};
