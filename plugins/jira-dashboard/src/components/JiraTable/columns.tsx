import React from 'react';
import { Link, TableColumn } from '@backstage/core-components';
import { Issue } from '@axis-backstage/plugin-jira-dashboard-common';
import Typography from '@mui/material/Typography';
import { getIssueUrl } from '../../lib';
import { EntityPeekAheadPopover } from '@backstage/plugin-catalog-react';

export const columns: TableColumn[] = [
  {
    title: 'Key',
    field: 'key',
    highlight: true,
    type: 'string',
    width: '30%',

    render: (issue: Partial<Issue>) => {
      if (!issue.self || !issue.key) {
        return null;
      }
      return (
        <Link
          to={getIssueUrl(issue.self, issue.key)}
          title="Go to issue in Jira"
        >
          <img
            src={issue.fields?.issuetype.iconUrl}
            alt={issue.fields?.issuetype.name}
            style={{ paddingRight: '15px' }}
          />
          {issue.key}
        </Link>
      );
    },
  },
  {
    title: 'Summary',
    field: 'fields.summary',
    highlight: true,
    type: 'string',
    width: '50%',
    render: (issue: Partial<Issue>) => {
      if (!issue.self || !issue.key) {
        return null;
      }
      return (
        <Link
          style={{ lineHeight: 1.5 }}
          to={getIssueUrl(issue.self, issue.key)}
          title="Go to issue in Jira"
        >
          {issue.fields?.summary}
        </Link>
      );
    },
  },
  {
    title: 'Status',
    field: 'fields.status.name',
    highlight: true,
    type: 'string',
    width: '30%',
  },
  {
    title: 'Assignee',
    field: 'fields.assignee.displayName',
    highlight: true,
    type: 'string',
    width: '10%',

    render: (issue: Partial<Issue>) => {
      if (!issue.fields?.assignee)
        return <Typography style={{ color: 'grey' }}>Unassigned</Typography>;
      return (
        <EntityPeekAheadPopover
          entityRef={`user:default/${issue.fields?.assignee.name}`}
        >
          <Link to={`/catalog/default/user/${issue.fields?.assignee.name}`}>
            {issue.fields?.assignee.displayName}
          </Link>
        </EntityPeekAheadPopover>
      );
    },
  },
];
