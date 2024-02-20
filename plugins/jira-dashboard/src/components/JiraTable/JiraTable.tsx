import React from 'react';
import Typography from '@mui/material/Typography';
import { JiraDataResponse } from '@axis-backstage/plugin-jira-dashboard-common';
import { ErrorPanel, Table } from '@backstage/core-components';
import { capitalize } from 'lodash';
import { columns } from './columns';

type Props = {
  tableContent: JiraDataResponse;
};

export const JiraTable = ({ tableContent }: Props) => {
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
    <Table
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
      data={tableContent.issues || []}
      columns={columns}
      emptyContent={
        <Typography display="flex" justifyContent="center" pt={30}>
          No issues found&nbsp;
        </Typography>
      }
      style={{
        height: '500px',
        padding: '20px',
        overflowY: 'auto',
        width: '100%',
      }}
    />
  );
};
