import { Avatar, Link, TableColumn } from '@backstage/core-components';
import { Issue } from '@axis-backstage/plugin-jira-dashboard-common';
import Typography from '@mui/material/Typography';
import { getIssueUrl } from '../../lib';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { DateTime } from 'luxon';
import { EntityPeekAheadPopover } from '@backstage/plugin-catalog-react';
import { AssigneeCell } from './cells/AssigneeCell';

export const columnKey: TableColumn<Issue> = {
  title: 'Key',
  field: 'key',
  highlight: true,
  type: 'string',
  width: '15%',

  render: (issue: Partial<Issue>) => {
    if (!issue.self || !issue.key) {
      return null;
    }
    return (
      <Link to={getIssueUrl(issue.self, issue.key)} title="Go to issue in Jira">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src={issue.fields?.issuetype.iconUrl}
            alt={issue.fields?.issuetype.name}
            style={{ paddingRight: '15px' }}
          />
          {issue.key}
        </Box>
      </Link>
    );
  },
};

export const columnSummary: TableColumn<Issue> = {
  title: 'Summary',
  field: 'fields.summary',
  highlight: true,
  type: 'string',
  width: '45%',
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
};

export const columnPriority: TableColumn<Issue> = {
  title: 'P',
  tooltip: 'Priority',
  field: 'fields.priority.name',
  highlight: true,
  type: 'string',
  width: '10%',
  render: (issue: Partial<Issue>) => {
    if (!issue.self || !issue.key) {
      return null;
    }
    return (
      <Link to={getIssueUrl(issue.self, issue.key)} title="Go to issue in Jira">
        <img
          alt={issue.fields?.priority?.name}
          src={issue.fields?.priority?.iconUrl}
          title={issue.fields?.priority?.name}
          width={20}
          height={20}
        />
      </Link>
    );
  },
};

export const columnStatus: TableColumn<Issue> = {
  title: 'Status',
  field: 'fields.status.name',
  highlight: true,
  type: 'string',
  width: '15%',

  render: (issue: Partial<Issue>) => {
    if (!issue.self || !issue.key) {
      return null;
    }
    return (
      <Link to={getIssueUrl(issue.self, issue.key)} title="Go to issue in Jira">
        <Chip
          label={issue.fields?.status.name}
          sx={{
            padding: '0',
            margin: '0',
            borderRadius: '5px 5px 5px 5px',
          }}
        />
      </Link>
    );
  },
};

export const columnAssignee: TableColumn<Issue> = {
  title: 'Assignee',
  field: 'fields.assignee.name',
  highlight: true,
  type: 'string',
  width: '20%',

  render: (issue: Partial<Issue>) => {
    return <AssigneeCell assignee={issue.fields?.assignee} />;
  }
};
export const columnUpdated: TableColumn<Issue> = {
  title: 'Updated',
  field: 'fields.updated',
  highlight: false,
  type: 'datetime',
  width: '10%',
  customSort: (a, b) => {
    if (a.fields?.updated && b.fields?.updated) {
      return new Date(a.fields.updated) > new Date(b.fields.updated) ? 1 : -1;
    }
    return 0;
  },
  render: (issue: Partial<Issue>) => {
    if (issue.fields?.updated) {
      return (
        <Typography
          sx={{ color: theme => theme.palette.text.secondary }}
          color="divider"
          variant="body2"
        >
          {DateTime.fromISO(issue.fields.updated).toFormat('dd/MMM/yy')}
        </Typography>
      );
    }
    return null;
  },
};

export const columns: TableColumn<Issue>[] = [
  columnKey,
  columnSummary,
  columnPriority,
  columnStatus,
  columnAssignee,
];
