import { JiraProjectCard } from './JiraProjectCard';
import mockedJiraCloudProject from './mockedJiraCloudProject.json';
import mockedProject from './mockedProject.json';
import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';

describe('JiraDashboardContent', () => {
  it('renders component without error', async () => {
    const rendered = await renderInTestApp(
      <JiraProjectCard project={mockedProject} />,
    );
    expect(rendered.getByText('Backstage | Software')).toBeInTheDocument();
  });

  it('renders component retreiving Jira Cloud data', async () => {
    const rendered = await renderInTestApp(
      <JiraProjectCard project={mockedJiraCloudProject} />,
    );
    expect(rendered.getByText('Jenkins | software')).toBeInTheDocument();
  });
});
