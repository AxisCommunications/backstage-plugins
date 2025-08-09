import { CSSProperties } from 'react';
import Typography from '@mui/material/Typography';
import {
  Issue,
  JiraDataResponse,
  Project,
} from '@axis-backstage/plugin-jira-dashboard-common';
import {
  ErrorPanel,
  InfoCard,
  Link,
  Table,
  TableColumn,
  TableFilter,
  TableOptions,
} from '@backstage/core-components';
import { capitalize } from 'lodash';
import { columns } from './columns';
import { getJiraBaseUrl, transformAssignees } from '../../lib';

// Infer the prop types from the Table component
type TableComponentProps = React.ComponentProps<typeof Table>;

type Props = {
  tableContent: JiraDataResponse;
  tableColumns?: TableColumn<Issue>[];
  tableStyle?: TableComponentProps['style'];
  /**
   * CSS styles to apply to the top-most element, being the table component or
   * the wrapping InfoCard component if filters are shown.
   * If no filters are shown, the style prop is merged with the tableStyle prop
   * and used in the table component.
   */
  style?: CSSProperties;
  showFilters?: TableFilter[] | boolean;
  project?: Project;
  tableOptions?: TableOptions<Issue>;
};

export const JiraTable = ({
  tableContent,
  tableColumns = columns,
  tableStyle,
  tableOptions,
  style,
  showFilters,
  project,
}: Props) => {
  if (!tableContent) {
    return (
      <ErrorPanel
        data-testid="error-panel"
        error={Error('Table could not be rendered')}
      />
    );
  }

  transformAssignees(tableContent?.issues || []);

  const nbrOfIssues = tableContent?.issues?.length ?? 0;

  const defaultFilters: TableFilter[] = [
    { column: 'Status', type: 'multiple-select' },
    { column: 'P', type: 'multiple-select' },
    { column: 'Assignee', type: 'multiple-select' },
  ];

  let filters: TableFilter[] = [];

  if (showFilters) {
    if (Array.isArray(showFilters)) {
      filters = showFilters;
    } else {
      filters = defaultFilters;
    }
  }

  let title = (
    <Typography component="div" variant="h5" data-testid="table-header">
      {`${capitalize(tableContent.name)} (${nbrOfIssues})`}
    </Typography>
  );

  if (project && tableContent.query) {
    title = (
      <Link
        to={`${getJiraBaseUrl(project.self)}/issues/?jql=${tableContent.query}`}
        variant="h5"
        data-testid="table-header"
      >
        {`${capitalize(tableContent.name)} (${nbrOfIssues})`}
      </Link>
    );
  }

  if (showFilters) {
    return (
      <InfoCard title={title} headerStyle={style}>
        <Table<Issue>
          options={{
            paging: false,
            padding: 'dense',
            search: true,
            ...tableOptions,
          }}
          filters={filters}
          emptyContent={
            <Typography display="flex" justifyContent="center" pt={30}>
              No issues found&nbsp;
            </Typography>
          }
          data={tableContent.issues || []}
          columns={tableColumns}
          style={{
            padding: '0px',
            boxShadow: 'none',
            ...tableStyle,
          }}
        />
      </InfoCard>
    );
  }

  return (
    <Table<Issue>
      title={title}
      options={{
        paging: false,
        padding: 'dense',
        search: true,
        ...tableOptions,
      }}
      filters={filters}
      emptyContent={
        <Typography display="flex" justifyContent="center" pt={30}>
          No issues found&nbsp;
        </Typography>
      }
      data={tableContent.issues || []}
      columns={tableColumns}
      style={{ ...tableStyle, ...style }}
    />
  );
};
