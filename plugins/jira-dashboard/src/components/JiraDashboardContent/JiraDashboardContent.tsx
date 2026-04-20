import {
  Progress,
  ResponseErrorPanel,
  TableFilter,
  TableOptions,
  TabbedCard,
  CardTab,
} from '@backstage/core-components';
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
    <>
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
    </>
  );
};
