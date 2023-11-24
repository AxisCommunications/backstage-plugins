import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import { JiraDataResponse } from '@axis-backstage/plugin-jira-dashboard-common';
import { ErrorPanel, Table } from '@backstage/core-components';
import { capitalize } from 'lodash';
import { columns } from './columns';

type Props = {
  tableContent: JiraDataResponse;
};

const useStyles = makeStyles(theme => ({
  root: {
    colorScheme: theme.palette.type,
  },
}));

export const JiraTable = ({ tableContent }: Props) => {
  const classes = useStyles();

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
    <div className={classes.root}>
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
          <Typography
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: 30,
            }}
          >
            No issues found&nbsp;
          </Typography>
        }
        style={{
          height: '500px',
          padding: '20px',
          overflowY: 'scroll',
          width: '100%',
        }}
      />
    </div>
  );
};
