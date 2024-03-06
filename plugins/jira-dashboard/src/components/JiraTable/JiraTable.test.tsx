import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { JiraTable } from './JiraTable';
import mockedJiraDataResponse from './mockedJiraDataResponse.json';
import mockedJiraProject from './mockedJiraProject.json';
import type { JiraDataResponse } from '@axis-backstage/plugin-jira-dashboard-common';

describe('JiraTable', () => {
  it('renders header', async () => {
    const { queryByText } = await renderInTestApp(
      <JiraTable
        tableContent={mockedJiraDataResponse as JiraDataResponse}
        project={mockedJiraProject}
      />,
    );
    const element = queryByText(/Open issues \(\d+\)/);
    expect(element).toBeInTheDocument();
  });
  it('renders error when data is missing', async () => {
    const { getByText } = await renderInTestApp(
      <JiraTable tableContent={undefined!} project={mockedJiraProject} />,
    );
    expect(getByText('Table could not be rendered')).toBeInTheDocument();
  });
});
