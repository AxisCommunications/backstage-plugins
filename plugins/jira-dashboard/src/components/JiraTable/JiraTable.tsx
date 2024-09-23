import React from 'react';
import Typography from '@mui/material/Typography';
import {
  Issue,
  JiraDataResponse,
  Project,
} from '@axis-backstage/plugin-jira-dashboard-common';
import {
  ErrorPanel,
  InfoCard,
  Link,
  Table,
  TableColumn,
  TableFilter,
} from '@backstage/core-components';
import { capitalize } from 'lodash';
import { columns } from './columns';
import { getJiraBaseUrl, transformAssignees } from '../../lib';

// Infer the prop types from the Table component
type TableComponentProps = React.ComponentProps<typeof Table>;

type Props = {
  tableContent: JiraDataResponse;
  tableColumns?: TableColumn<Issue>[];
  tableStyle?: TableComponentProps['style'];
  showFilters?: TableFilter[] | boolean;
  project?: Project;
};

export const JiraTable = ({
  tableContent,
  tableColumns = columns,
  tableStyle = {
    height: 'max-content',
    maxHeight: '500px',
    padding: '20px',
    overflowY: 'auto',
    width: '100%',
  },
  showFilters,
  project,
}: Props) => {
  if (!tableContent) {
    return (
      <ErrorPanel
        data-testid="error-panel"
        error={Error('Table could not be rendered')}
      />
    );
  }

  transformAssignees(tableContent.issues);

  const nbrOfIssues = tableContent?.issues?.length ?? 0;

  const defaultFilters: TableFilter[] = [
    { column: 'Status', type: 'multiple-select' },
    { column: 'P', type: 'multiple-select' },
    { column: 'Assignee', type: 'multiple-select' },
  ];

  let filters: TableFilter[] = [];

  if (showFilters) {
    if (Array.isArray(showFilters)) {
      filters = showFilters;
    } else {
      filters = defaultFilters;
    }
  }

  let title = (
    <Typography component="div" variant="h5" data-testid="table-header">
      {`${capitalize(tableContent.name)} (${nbrOfIssues})`}
    </Typography>
  );

  if (project && tableContent.query) {
    title = (
      <Link
        to={`${getJiraBaseUrl(project.self)}/issues/?jql=${tableContent.query}`}
        variant="h5"
        data-testid="table-header"
      >
        {`${capitalize(tableContent.name)} (${nbrOfIssues})`}
      </Link>
    );
  }

  if (showFilters) {
    return (
      <InfoCard title={title}>
        <Table<Issue>
          options={{
            paging: false,
            padding: 'dense',
            search: true,
          }}
          filters={filters}
          emptyContent={
            <Typography display="flex" justifyContent="center" pt={30}>
              No issues found&nbsp;
            </Typography>
          }
          data={tableContent.issues || []}
          columns={tableColumns}
          style={{
            ...tableStyle,
            padding: '0px',
            boxShadow: 'none',
          }}
        />
      </InfoCard>
    );
  }

  return (
    <Table<Issue>
      title={title}
      options={{
        paging: false,
        padding: 'dense',
        search: true,
      }}
      filters={filters}
      emptyContent={
        <Typography display="flex" justifyContent="center" pt={30}>
          No issues found&nbsp;
        </Typography>
      }
      data={tableContent.issues || []}
      columns={tableColumns}
      style={tableStyle}
    />
  );
};
