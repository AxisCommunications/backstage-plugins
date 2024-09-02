import React from 'react';
import Typography from '@mui/material/Typography';
import {
  Issue,
  JiraDataResponse,
} from '@axis-backstage/plugin-jira-dashboard-common';
import { ErrorPanel, Table, TableColumn } from '@backstage/core-components';
import { capitalize } from 'lodash';
import { columns } from './columns';

// Infer the prop types from the Table component
type TableComponentProps = React.ComponentProps<typeof Table>;

type Props = {
  tableContent: JiraDataResponse;
  tableColumns?: TableColumn<Issue>[];
  tableStyle?: TableComponentProps['style'];
};

export const JiraTable = ({
  tableContent,
  tableColumns = columns,
  tableStyle = {
    height: '500px',
    padding: '20px',
    overflowY: 'auto',
    width: '100%',
  }
}: Props) => {
  if (!tableContent) {
    return (
      <ErrorPanel
        data-testid="error-panel"
        error={Error('Table could not be rendered')}
      />
    );
  }
  const nbrOfIssues = tableContent?.issues?.length ?? 0;

  return (
    <Table<Issue>
      title={
        <Typography component="div" variant="h5" data-testid="table-header">
          {`${capitalize(tableContent.name)} (${nbrOfIssues})`}
        </Typography>
      }
      options={{
        paging: false,
        padding: 'dense',
        search: true,
      }}
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
