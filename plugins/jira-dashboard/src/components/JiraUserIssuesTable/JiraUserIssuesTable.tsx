import { CSSProperties } from 'react';

import {
  Progress,
  ResponseErrorPanel,
  TableColumn,
  Table,
  TableOptions,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

import { Issue } from '@axis-backstage/plugin-jira-dashboard-common';

import {
  columnKey,
  columnPriority,
  columnStatus,
  columnSummary,
  columnUpdated,
  JiraTable,
} from '../JiraTable';
import { jiraDashboardApiRef } from '../../api';
import { useJiraUserIssues } from '../../hooks/useJiraUserIssues';

/**
 * Table properties for Table component in \@backstage/core-components
 * @public */
export type TableComponentProps = React.ComponentProps<typeof Table>;

/**
 * Jira user issues list card properties
 * @public */
export type JiraUserIssuesTableProps = {
  title?: string;
  maxResults?: number;
  tableStyle?: TableComponentProps['style'];
  style?: CSSProperties;
  tableOptions?: TableOptions<Issue>;
  filterName?: string;
};

const userColumns: TableColumn<Issue>[] = [
  columnKey,
  columnSummary,
  columnPriority,
  columnStatus,
  columnUpdated,
];

/**
 * Jira user issues list table.
 * @public */
export const JiraUserIssuesTable = ({
  title = 'My open issues',
  maxResults = 15,
  tableStyle,
  style,
  tableOptions,
  filterName = 'default',
}: JiraUserIssuesTableProps) => {
  const api = useApi(jiraDashboardApiRef);

  const {
    data: jiraResponse,
    loading,
    error,
  } = useJiraUserIssues(maxResults, filterName, api);

  if (loading) {
    return <Progress />;
  }
  if (error) {
    return <ResponseErrorPanel error={error} />;
  }
  if (!jiraResponse) {
    return (
      <ResponseErrorPanel
        error={Error('Could not fetch Jira issues for user')}
      />
    );
  }

  if (jiraResponse) {
    return (
      <JiraTable
        tableContent={{
          name: title,
          type: 'component',
          issues: jiraResponse,
        }}
        tableColumns={userColumns}
        tableStyle={tableStyle}
        tableOptions={tableOptions}
        style={style}
      />
    );
  }
  return null;
};
