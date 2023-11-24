import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { JiraProjectCard } from './JiraProjectCard';
import mockedProject from './mockedProject.json';

describe('JiraDashboardContent', () => {
  it('renders component without error', async () => {
    const rendered = await renderInTestApp(
      <JiraProjectCard project={mockedProject} />,
    );
    expect(rendered.getByText('Backstage | Software')).toBeInTheDocument();
  });
});
