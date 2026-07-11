import { TableColumn } from '@backstage/core-components';
import { Issue } from '@axis-backstage/plugin-jira-dashboard-common';
import { Badge, Flex, Link, Text } from '@backstage/ui';
import { getIssueUrl } from '../../lib';
import { DateTime } from 'luxon';
import { AssigneeCell } from './cells/AssigneeCell';

export const columnKey: TableColumn<Issue> = {
  title: 'Key',
  field: 'key',
  highlight: true,
  type: 'string',
  width: '15%',
  cellStyle: {
    whiteSpace: 'nowrap',
  },
  render: (issue: Partial<Issue>) => {
    if (!issue.self || !issue.key) {
      return null;
    }
    return (
      <Link
        href={getIssueUrl(issue.self, issue.key)}
        title="Go to issue in Jira"
        standalone
        target="_blank"
        rel="noopener noreferrer"
      >
        <Flex align="center">
          <img
            src={issue.fields?.issuetype.iconUrl}
            alt={issue.fields?.issuetype.name}
            style={{ paddingRight: '15px' }}
          />
          {issue.key}
        </Flex>
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
  cellStyle: {
    maxWidth: 250,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  render: (issue: Partial<Issue>) => {
    if (!issue.self || !issue.key) {
      return null;
    }
    return (
      <Link
        style={{ lineHeight: 1.5 }}
        href={getIssueUrl(issue.self, issue.key)}
        title="Go to issue in Jira"
        standalone
        target="_blank"
        rel="noopener noreferrer"
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
      <Link
        href={getIssueUrl(issue.self, issue.key)}
        title="Go to issue in Jira"
        standalone
        target="_blank"
        rel="noopener noreferrer"
      >
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
      <Link
        href={getIssueUrl(issue.self, issue.key)}
        title="Go to issue in Jira"
        standalone
        target="_blank"
        rel="noopener noreferrer"
      >
        <Badge size="small">{issue.fields?.status.name}</Badge>
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
  },
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
        <Text color="secondary" variant="body-medium">
          {DateTime.fromISO(issue.fields.updated).toFormat('dd/MMM/yy')}
        </Text>
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
