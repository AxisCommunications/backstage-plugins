import React from 'react';
import Typography from '@mui/material/Typography';
import {
  JiraDataResponse,
  Project,
} from '@axis-backstage/plugin-jira-dashboard-common';
import {
  ErrorPanel,
  Table,
  Link,
  SupportButton,
} from '@backstage/core-components';
import { capitalize } from 'lodash';
import { columns } from './columns';
import { getJiraUrl } from '../../lib';
import Alert from '@mui/material/Alert';

type Props = {
  tableContent: JiraDataResponse;
  project: Project;
};
export const JiraTable = ({ tableContent, project }: Props) => {
  if (!tableContent) {
    return <ErrorPanel error={Error('Table could not be rendered')} />;
  }
  const nbrOfIssues = tableContent?.issues?.length ?? 0;
  const tableTitle = (
    <Link to={`${getJiraUrl(project)}issues/?jql=${tableContent.query}`}>
      {`${capitalize(tableContent.name)} (${nbrOfIssues})`}
    </Link>
  );
  if (tableContent.errorMessages)
    return (
      <Table
        title={tableTitle}
        options={{
          paging: false,
          padding: 'dense',
          search: true,
        }}
        data={[]} // Left empty so as Alert can be shown in emptyContent
        columns={columns}
        emptyContent={
          <Typography>
            <Alert severity="error">
              <Alert>This Filter has the following issue(s).</Alert>
              <Typography>
                <ul>
                  {tableContent.errorMessages.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                Check jira annotations are correct.
                <br />
                If issue persists contact support <br />
              </Typography>
              <SupportButton />
            </Alert>
          </Typography>
        }
        style={{
          height: `max-content`,
          maxHeight: `500px`,
          padding: '20px',
          overflowY: 'scroll',
          width: '100%',
        }}
      />
    );
  return (
    <Table
      title={tableTitle}
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
            paddingTop: 15,
          }}
        >
          No issues found&nbsp;
        </Typography>
      }
      style={{
        height: `max-content`,
        maxHeight: `500px`,
        padding: '10px',
        overflowY: 'scroll',
        width: '100%',
      }}
    />
  );
};
