import React from 'react';
import { Avatar, Link, TableColumn } from '@backstage/core-components';
import { Issue } from '@axis-backstage/plugin-jira-dashboard-common';
import Typography from '@mui/material/Typography';
import { getIssueUrl } from '../../lib';

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

    render: (issue: Partial<Issue>) => {
      if (!issue.self || !issue.key) {
        return null;
      }
      return (
        <Link
          to={getIssueUrl(issue.self, issue.key)}
          title="Go to issue in Jira"
        >
          {issue.fields?.status.name}
        </Link>
      );
    },
  },
  {
    title: 'Assignee',
    field: 'fields.assignee.displayName',
    highlight: true,
    type: 'string',
    width: '10%',

    render: (issue: Partial<Issue>) => {
      if (issue.fields?.assignee?.displayName) {
        return (
          <div style={{ display: 'flex' }}>
            <Avatar
              picture={issue.fields?.assignee?.avatarUrls['48x48']}
              customStyles={{
                width: 35,
                height: 35,
                marginRight: 5,
              }}
            />
            <Typography>{issue.fields.assignee.displayName}</Typography>
          </div>
        );
      } else if (issue.fields?.assignee?.name) {
        return (
          <Typography>{issue.fields.assignee.name.split('@')[0]}</Typography>
        );
      } else if (issue.fields?.assignee?.key) {
        return <Typography>{issue.fields.assignee.key}</Typography>;
      }
      return (
        <Typography
          sx={{ color: theme => theme.palette.text.disabled }}
          color="divider"
        >
          Unassigned
        </Typography>
      );
    },
  },
];
