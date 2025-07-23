import { renderInTestApp } from '@backstage/test-utils';
import { JiraProjectCard } from './JiraProjectCard';
import mockedProject from './mockedProject.json';
import mockedJiraCloudProject from './mockedJiraCloudProject.json';

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
