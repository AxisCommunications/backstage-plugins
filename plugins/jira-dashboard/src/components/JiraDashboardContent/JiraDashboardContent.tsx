import {
  Content,
  ContentHeader,
  Progress,
  ResponseErrorPanel,
  SupportButton,
} from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import React from 'react';
import { JiraProjectCard } from '../JiraProjectCard';
import { JiraTable } from '../JiraTable';
import { useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { jiraDashboardApiRef } from '../../api';
import { useJira } from '../../hooks/useJira';
import {
  JiraDataResponse,
  PROJECT_KEY_ANNOTATION,
} from '@internal/plugin-jira-dashboard-common';

export const JiraDashboardContent = () => {
  const { entity } = useEntity();
  const projectKey = entity?.metadata.annotations?.[PROJECT_KEY_ANNOTATION]!;
  const api = useApi(jiraDashboardApiRef);

  const {
    data: jiraResponse,
    loading,
    error,
  } = useJira(stringifyEntityRef(entity), projectKey, api);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  } else if (!jiraResponse || !jiraResponse.data || !jiraResponse.project) {
    return (
      <ResponseErrorPanel
        error={Error(
          `Could not fetch Jira Dashboard content for project key: ${projectKey}`,
        )}
      />
    );
  }

  return (
    <Content>
      <ContentHeader title="Jira Dashboard">
        <SupportButton>
          Jira Dashboard plugin lets you track Jira tickets
        </SupportButton>
      </ContentHeader>
      <Grid container spacing={3}>
        {jiraResponse && jiraResponse.data && (
          <>
            <Grid item md={6} xs={12} data-testid="project-card">
              <JiraProjectCard project={jiraResponse.project} />
            </Grid>
            {jiraResponse.data.map((value: JiraDataResponse) => (
              <Grid
                data-testid="issue-table"
                item
                key={value.name}
                md={6}
                xs={12}
              >
                <JiraTable tableContent={value} />
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </Content>
  );
};
