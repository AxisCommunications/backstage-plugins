import { render, screen } from '@testing-library/react';
import { JiraGrid } from './JiraGrid';
import {
  Project,
  JiraDataResponse,
} from '@axis-backstage/plugin-jira-dashboard-common';
import * as JiraTableModule from '../JiraTable';

jest.mock('../JiraProjectCard', () => ({
  JiraProjectCard: jest.fn(() => <div data-testid="mock-project-card" />),
}));

jest.mock('../JiraTable', () => ({
  JiraTable: jest.fn(({ tableContent }) => (
    <div data-testid={`mock-jira-table-${tableContent.name}`} />
  )),
}));

describe('JiraGrid', () => {
  const mockProject: Project = {
    key: 'PROJ',
    name: 'Test Project',
    description: 'A test project for unit testing.',
    avatarUrls: {
      '48x48': 'https://example.com/avatar48.png',
    },
    projectTypeKey: 'software',
    lead: {
      key: 'lead-key',
      displayName: 'Test Lead',
    },
    self: 'https://jira.example.com/project/PROJ',
  };

  const mockTableData: JiraDataResponse[] = [
    {
      name: 'Table One',
      type: 'component',
      issues: [],
    },
    {
      name: 'Table Two',
      type: 'filter',
      issues: [],
    },
  ];

  it('renders JiraProjectCard with correct props', () => {
    render(<JiraGrid project={mockProject} tableData={mockTableData} />);

    expect(screen.getByTestId('mock-project-card')).toBeInTheDocument();
  });

  it('renders one JiraTable per tableData item', () => {
    render(<JiraGrid project={mockProject} tableData={mockTableData} />);

    mockTableData.forEach(data => {
      expect(
        screen.getByTestId(`mock-jira-table-${data.name}`),
      ).toBeInTheDocument();
    });
  });

  it('passes the correct props to JiraTable', () => {
    const spy = jest.spyOn(JiraTableModule, 'JiraTable');

    render(
      <JiraGrid project={mockProject} tableData={mockTableData} showFilters />,
    );

    mockTableData.forEach(data => {
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          tableContent: data,
          project: mockProject,
          showFilters: true,
        }),
        {},
      );
    });
  });
});
