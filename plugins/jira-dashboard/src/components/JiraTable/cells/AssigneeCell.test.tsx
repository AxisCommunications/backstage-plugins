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

  it('renders displayName with EntityPeekAheadPopover and correct link when assignee is valid', () => {
    renderWithProviders(<AssigneeCell assignee={baseAssignee} />);
    expect(screen.getByTestId('peek-ahead')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/catalog/default/user/jane.doe',
    );
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByTestId('assignee-avatar')).toBeInTheDocument();
  });

  it('renders "Unassigned" when assignee name is an empty string', () => {
    renderWithProviders(
      <AssigneeCell
        assignee={{
          ...baseAssignee,
          name: '',
          displayName: '',
        }}
      />,
    );

    expect(screen.queryByTestId('peek-ahead')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Unassigned')).toBeInTheDocument();
    expect(screen.getByTestId('assignee-avatar')).toBeInTheDocument();
  });

  const unassignedNames = ['unassigned', 'Unassigned', 'UNASSIGNED'];

  test.each(unassignedNames)(
    'renders "Unassigned" when assignee name is "%s"',
    name => {
      renderWithProviders(
        <AssigneeCell
          assignee={{
            name,
            displayName: '',
            key: '',
            self: '',
            avatarUrls: {
              '48x48': '',
            },
          }}
        />,
      );

      expect(screen.queryByTestId('peek-ahead')).not.toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
      expect(screen.getByText('Unassigned')).toBeInTheDocument();
      expect(screen.getByTestId('assignee-avatar')).toBeInTheDocument();
    },
  );

  it('renders name if displayName is missing', () => {
    renderWithProviders(
      <AssigneeCell
        assignee={{
          name: 'john.smith',
          key: 'jsmith',
          self: '',
          displayName: '',
          avatarUrls: { '48x48': '' },
        }}
      />,
    );

    expect(screen.getByText('john.smith')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/catalog/default/user/john.smith',
    );
    expect(screen.getByTestId('assignee-avatar')).toBeInTheDocument();
  });

  it('renders "Unassigned" when assignee.name and displayName are both empty (no fallback to key)', () => {
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

    expect(screen.getByText('Unassigned')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByTestId('assignee-avatar')).toBeInTheDocument();
  });

  it('renders nothing when assignee is undefined', () => {
    const { container } = renderWithProviders(
      <AssigneeCell assignee={undefined} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('normalizes email-like assignee name (fridaja@backstage) to username', () => {
    renderWithProviders(
      <AssigneeCell
        assignee={{
          ...baseAssignee,
          name: 'fridaja@backstage',
          displayName: 'Frida J',
        }}
      />,
    );

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/catalog/default/user/fridaja',
    );
    expect(screen.getByText('Frida J')).toBeInTheDocument();
  });

  it('normalizes real email (alice@example.com) to username', () => {
    renderWithProviders(
      <AssigneeCell
        assignee={{
          ...baseAssignee,
          name: 'alice@example.com',
          displayName: 'Alice Example',
        }}
      />,
    );

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/catalog/default/user/alice',
    );
    expect(screen.getByText('Alice Example')).toBeInTheDocument();
  });
});
