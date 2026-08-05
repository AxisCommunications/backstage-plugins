import { screen, waitFor } from '@testing-library/react';
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import { homePageWidgetDataRef } from '@backstage/plugin-home-react/alpha';
import { JiraDashboardApi, jiraDashboardApiRef } from '../api';
import { jiraUserIssuesWidget } from './homePageWidget';

const mockJiraApi = {
  getLoggedInUserIssues: jest.fn().mockResolvedValue([]),
} as unknown as JiraDashboardApi;

describe('Jira user issues homepage widget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers and renders a configurable homepage widget', async () => {
    const tester = createExtensionTester(jiraUserIssuesWidget, {
      config: {
        title: 'Team Jira Issues',
        maxResults: 25,
        filterName: 'Unresolved',
        bottomLink: {
          link: 'https://jira.example.com/issues',
          title: 'Open Jira',
        },
      },
    });
    const widget = tester.get(homePageWidgetDataRef);

    expect(widget.name).toBe('JiraUserIssuesViewCard');
    expect(widget.title).toBe('Team Jira Issues');
    expect(widget.layout).toEqual({
      width: { minColumns: 4, defaultColumns: 8 },
      height: { minRows: 4 },
    });

    renderInTestApp(widget.component, {
      apis: [[jiraDashboardApiRef, mockJiraApi]],
    });

    expect(await screen.findByText('Team Jira Issues')).toBeInTheDocument();
    expect(await screen.findByText('Open Jira')).toBeInTheDocument();
    await waitFor(() =>
      expect(mockJiraApi.getLoggedInUserIssues).toHaveBeenCalledWith(
        25,
        'Unresolved',
      ),
    );
  });
});
