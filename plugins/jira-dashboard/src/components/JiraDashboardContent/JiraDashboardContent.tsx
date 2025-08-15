import {
  Content,
  ContentHeader,
  Progress,
  ResponseErrorPanel,
  SupportButton,
  TableFilter,
  TableOptions,
  TabbedCard,
  CardTab,
} from '@backstage/core-components';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { jiraDashboardApiRef } from '../../api';
import { useJira } from '../../hooks/useJira';
import { Issue } from '@axis-backstage/plugin-jira-dashboard-common';
import { JiraGrid } from './JiraGrid';

export const JiraDashboardContent = (props?: {
  showFilters?: TableFilter[] | boolean;
  tableOptions?: TableOptions<Issue>;
}) => {
  const { entity } = useEntity();
  const api = useApi(jiraDashboardApiRef);

  const {
    data: jiraResponse,
    loading,
    error,
  } = useJira(stringifyEntityRef(entity), api);

  if (loading) return <Progress />;
  if (error) return <ResponseErrorPanel error={error} />;
  if (!jiraResponse?.data || !jiraResponse?.project) {
    return (
      <ResponseErrorPanel
        error={Error(
          'Could not fetch Jira Dashboard content for defined project key',
        )}
      />
    );
  }

  const projects = Array.isArray(jiraResponse.project)
    ? jiraResponse.project
    : [];

  return (
    <Content>
      <ContentHeader title="Jira Dashboard">
        <SupportButton>
          <Typography variant="h6">How it works</Typography>
          The Jira Dashboard plugin provides quick access to Jira issue
          summaries. Add Jira components and filters via annotations in your
          entity's `catalog-info.yaml`.
          <Typography mt={1} variant="h6">
            Documentation
          </Typography>
          <Link href="https://github.com/AxisCommunications/backstage-plugins/tree/main/plugins/jira-dashboard">
            here.
          </Link>
        </SupportButton>
      </ContentHeader>

      {projects.length > 1 ? (
        <TabbedCard title="Jira Projects" data-testid="tabbed-card">
          {projects.map(project => (
            <CardTab key={project.key} label={project.name}>
              <JiraGrid
                project={project}
                tableData={jiraResponse.data}
                showFilters={props?.showFilters}
                tableOptions={props?.tableOptions}
              />
            </CardTab>
          ))}
        </TabbedCard>
      ) : (
        <JiraGrid
          project={projects[0]}
          tableData={jiraResponse.data}
          showFilters={props?.showFilters}
          tableOptions={props?.tableOptions}
        />
      )}
    </Content>
  );
};
