import React from 'react';

import { BottomLinkProps, InfoCard } from '@backstage/core-components';

import { JiraUserIssuesTable } from '../JiraUserIssuesTable';

/**
 * Jira user issues list card properties
 * @public */
export type JiraUserIssuesCardProps = {
  title?: string;
  maxResults?: number;
  bottomLinkProps?: BottomLinkProps;
};

/**
 * Jira user issues list card.
 * @public */
export const JiraUserIssuesCard = ({
  title,
  maxResults,
  bottomLinkProps,
}: JiraUserIssuesCardProps) => {
  return (
    <InfoCard title={title} variant="fullHeight" deepLink={bottomLinkProps}>
      <JiraUserIssuesTable
        maxResults={maxResults}
        tableOptions={{
          toolbar: false,
          search: false,
          paging: true,
          pageSize: 10,
        }}
      />
    </InfoCard>
  );
};
