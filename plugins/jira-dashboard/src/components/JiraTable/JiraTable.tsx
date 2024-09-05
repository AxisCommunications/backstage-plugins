import React from 'react';
import Typography from '@mui/material/Typography';
import { JiraDataResponse } from '@axis-backstage/plugin-jira-dashboard-common';
import {
  ErrorPanel,
  InfoCard,
  Table,
  TableFilter,
} from '@backstage/core-components';
import { capitalize } from 'lodash';
import { columns } from './columns';

type Props = {
  tableContent: JiraDataResponse;
  showFilters?: boolean;
};

export const JiraTable = ({ tableContent, showFilters }: Props) => {
  if (!tableContent) {
    return (
      <ErrorPanel
        data-testid="error-panel"
        error={Error('Table could not be rendered')}
      />
    );
  }
  const nbrOfIssues = tableContent?.issues?.length ?? 0;

  const filters: TableFilter[] = showFilters
    ? [
        {
          column: 'Status',
          type: 'multiple-select',
        },
        {
          column: 'Priority',
          type: 'multiple-select',
        },
      ]
    : [];

  const title = (
    <Typography component="div" variant="h5" data-testid="table-header">
      {`${capitalize(tableContent.name)} (${nbrOfIssues})`}
    </Typography>
  );

  return (
    <InfoCard title={title}>
      <Table
        options={{
          paging: false,
          padding: 'dense',
          search: true,
        }}
        filters={filters}
        data={tableContent.issues || []}
        columns={columns}
        emptyContent={
          <Typography display="flex" justifyContent="center" pt={30}>
            No issues found&nbsp;
          </Typography>
        }
        style={{
          height: `max-content`,
          maxHeight: `500px`,
          overflowY: 'auto',
          width: '100%',
          boxShadow: 'none',
        }}
      />
    </InfoCard>
  );
};
