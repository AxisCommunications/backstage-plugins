import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { JiraTable } from './JiraTable';
import mockedJiraDataResponse from './mockedJiraDataResponse.json';
import type { JiraDataResponse } from '@axis-backstage/plugin-jira-dashboard-common';

describe('JiraTable', () => {
  it('renders header', async () => {
    const { getByTestId } = await renderInTestApp(
      <JiraTable tableContent={mockedJiraDataResponse as JiraDataResponse} />,
    );
    expect(getByTestId('table-header')).toBeInTheDocument();
  });

  it('renders no content message when no issues passed', async () => {
    const emptyJiraDataResponse = {
      name: 'Open Issues',
      type: 'filter',
      issues: [],
    } as JiraDataResponse;
    const { getByText } = await renderInTestApp(
      <JiraTable tableContent={emptyJiraDataResponse} />,
    );
    expect(getByText('No issues found')).toBeInTheDocument();
  });

  it('renders error when data is missing', async () => {
    const { getByText } = await renderInTestApp(
      <JiraTable tableContent={undefined!} />,
    );
    expect(getByText('Table could not be rendered')).toBeInTheDocument();
  });
});
