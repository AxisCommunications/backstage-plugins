import { renderInTestApp } from '@backstage/test-utils';
import { JiraTable } from './JiraTable';
import mockedJiraDataResponse from './mockedJiraDataResponse.json';
import mockedProject from '../JiraProjectCard/mockedProject.json';
import type { JiraDataResponse } from '@axis-backstage/plugin-jira-dashboard-common';

describe('JiraTable', () => {
  it('renders header', async () => {
    const { getByTestId } = await renderInTestApp(
      <JiraTable
        tableContent={mockedJiraDataResponse as JiraDataResponse}
        project={mockedProject}
      />,
    );
    expect(getByTestId('table-header')).toBeInTheDocument();
  });

  it('renders no content message when no issues passed', async () => {
    const emptyJiraDataResponse = {
      name: 'Open Issues',
      type: 'filter',
      query: 'resolution = Unresolved ORDER BY updated DESC',
      issues: [],
    } as JiraDataResponse;
    const { getByText } = await renderInTestApp(
      <JiraTable
        tableContent={emptyJiraDataResponse}
        project={mockedProject}
      />,
    );
    expect(getByText('No issues found')).toBeInTheDocument();
  });

  it('renders error when data is missing', async () => {
    const { getByText } = await renderInTestApp(
      <JiraTable tableContent={undefined!} project={undefined!} />,
    );
    expect(getByText('Table could not be rendered')).toBeInTheDocument();
  });

  describe('JiraTable', () => {
    it('does not render search field or toolbar when tableOptions.toolbar and tableOptions.search are false', async () => {
      const { queryByRole, queryByPlaceholderText } = await renderInTestApp(
        <JiraTable
          tableContent={mockedJiraDataResponse as JiraDataResponse}
          tableOptions={{ toolbar: false, search: false }}
        />,
      );
      expect(queryByRole('toolbar')).not.toBeInTheDocument();
      expect(queryByPlaceholderText('Search')).not.toBeInTheDocument();
    });
  });
});
