import React from 'react';
import { render, screen } from '@testing-library/react';
import { AssigneeCell } from './AssigneeCell';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import { Issue } from '@axis-backstage/plugin-jira-dashboard-common';

jest.mock('@backstage/plugin-catalog-react', () => ({
  EntityPeekAheadPopover: ({ children }: any) => (
    <div data-testid="peek-ahead">{children}</div>
  ),
}));

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <MemoryRouter>
      <ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>
    </MemoryRouter>,
  );

describe('AssigneeCell', () => {
  const baseAssignee: Issue['fields']['assignee'] = {
    name: 'jane.doe',
    key: 'jdoe',
    self: '',
    displayName: 'Jane Doe',
    avatarUrls: { '48x48': 'http://example.com/avatar.jpg' },
  };

  it('renders displayName with EntityPeekAheadPopover and link when key is not unassigned', () => {
    renderWithProviders(<AssigneeCell assignee={baseAssignee} />);
    expect(screen.getByTestId('peek-ahead')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/catalog/default/user/jane.doe',
    );
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renders displayName as plain Typography when key is "unassigned"', () => {
    renderWithProviders(
      <AssigneeCell
        assignee={{
          ...baseAssignee,
          key: 'unassigned',
        }}
      />,
    );
    expect(screen.queryByTestId('peek-ahead')).not.toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders name prefix if displayName is missing', () => {
    renderWithProviders(
      <AssigneeCell
        assignee={{
          name: 'john.smith@example.com',
          key: 'jsmith',
          self: '',
          displayName: '',
          avatarUrls: { '48x48': '' },
        }}
      />,
    );
    expect(screen.getByText('john.smith')).toBeInTheDocument();
  });

  it('renders key if name and displayName are missing', () => {
    renderWithProviders(
      <AssigneeCell
        assignee={{
          key: 'userkey123',
          name: '',
          self: '',
          displayName: '',
          avatarUrls: { '48x48': '' },
        }}
      />,
    );
    expect(screen.getByText('userkey123')).toBeInTheDocument();
  });

  it('renders empty Typography when assignee is undefined', () => {
    const { container } = renderWithProviders(
      <AssigneeCell assignee={undefined} />,
    );
    const typography = container.querySelector('p');
    expect(typography).toBeInTheDocument();
    expect(typography?.textContent).toBe('');
  });
});
