import React from 'react';

import {
  BottomLinkProps,
  InfoCard,
  TableOptions,
} from '@backstage/core-components';

import {
  JiraUserIssuesTable,
  TableComponentProps,
} from '../JiraUserIssuesTable';

import { Issue } from '@axis-backstage/plugin-jira-dashboard-common';

/**
 * Jira user issues list card properties
 * @public */
export type JiraUserIssuesCardProps = {
  title?: string;
  maxResults?: number;
  bottomLinkProps?: BottomLinkProps;
  tableOptions?: TableOptions<Issue>;
  tableStyle?: TableComponentProps['style'];
  filterName?: string;
};

/**
 * Jira user issues list card.
 * @public */
export const JiraUserIssuesCard = ({
  title,
  maxResults,
  bottomLinkProps,
  tableOptions = {
    toolbar: false,
    search: false,
    paging: true,
    pageSize: 10,
  },
  tableStyle = {
    padding: '0px',
    overflowY: 'auto',
    width: '100%',
  },
  filterName,
}: JiraUserIssuesCardProps) => {
  return (
    <InfoCard title={title} variant="fullHeight" deepLink={bottomLinkProps}>
      <JiraUserIssuesTable
        maxResults={maxResults}
        tableOptions={tableOptions}
        tableStyle={tableStyle}
        filterName={filterName}
      />
    </InfoCard>
  );
};
