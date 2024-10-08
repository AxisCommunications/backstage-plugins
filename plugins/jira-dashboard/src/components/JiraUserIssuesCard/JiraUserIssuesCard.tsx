import {
  BottomLinkProps,
  InfoCard,
  Progress,
  ResponseErrorPanel,
  TableColumn,
} from '@backstage/core-components';

import React from 'react';
import {
  columnKey,
  columnPriority,
  columnStatus,
  columnSummary,
  columnUpdated,
  JiraTable,
} from '../JiraTable';
import { useApi } from '@backstage/core-plugin-api';
import { jiraDashboardApiRef } from '../../api';
import { useJiraUserIssues } from '../../hooks/useJiraUserIssues';
import { Issue } from '@axis-backstage/plugin-jira-dashboard-common';

/**
 * Jira user issues list card properties
 * @public */
export type JiraUserIssuesCardProps = {
  title?: string;
  maxResults?: number;
  bottomLinkProps?: BottomLinkProps;
};

export const userColumns: TableColumn<Issue>[] = [
  columnKey,
  columnSummary,
  columnPriority,
  columnStatus,
  columnUpdated,
];

/**
 * Jira user issues list card.
 * @public */
export const JiraUserIssuesCard = ({
  title = 'My open issues',
  maxResults = 15,
  bottomLinkProps,
}: JiraUserIssuesCardProps) => {
  const api = useApi(jiraDashboardApiRef);

  const {
    data: jiraResponse,
    loading,
    error,
  } = useJiraUserIssues(maxResults, api);

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
      <InfoCard variant="fullHeight" deepLink={bottomLinkProps}>
        <JiraTable
          tableContent={{
            name: title,
            type: 'component',
            issues: jiraResponse,
          }}
          tableColumns={userColumns}
          tableStyle={{
            height: '500px',
            padding: '0px',
            overflowY: 'auto',
            width: '100%',
          }}
        />
      </InfoCard>
    );
  }
  return null;
};
