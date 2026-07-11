import { CSSProperties } from 'react';
import { Flex, Link, Text } from '@backstage/ui';
import {
  Issue,
  JiraDataResponse,
  Project,
} from '@axis-backstage/plugin-jira-dashboard-common';
import {
  ErrorPanel,
  Table,
  TableColumn,
  TableFilter,
  TableOptions,
} from '@backstage/core-components';
import { EntityInfoCard } from '@backstage/plugin-catalog-react';
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
   * CSS styles merged into the table component's style (after tableStyle).
   * Only applied when filters are not shown; with filters the table is wrapped
   * in an EntityInfoCard and this is ignored.
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
    <Text as="span" variant="title-small" data-testid="table-header">
      {`${capitalize(tableContent.name)} (${nbrOfIssues})`}
    </Text>
  );

  if (project && tableContent.query) {
    title = (
      <Link
        href={`${getJiraBaseUrl(project.self)}/issues/?jql=${
          tableContent.query
        }`}
        variant="title-small"
        data-testid="table-header"
        standalone
      >
        {`${capitalize(tableContent.name)} (${nbrOfIssues})`}
      </Link>
    );
  }

  const baseTableStyle: CSSProperties = {
    width: '100%',
    maxHeight: '500px',
    padding: '20px',
    overflowY: 'auto',
    boxSizing: 'border-box',
    overflowX: 'auto',
    display: 'block',
    ...tableStyle,
  };

  if (showFilters) {
    return (
      <EntityInfoCard title={title}>
        <Table<Issue>
          options={{
            paging: false,
            padding: 'dense',
            search: true,
            ...tableOptions,
          }}
          filters={filters}
          emptyContent={
            <Flex justify="center" py="8">
              <Text>No issues found&nbsp;</Text>
            </Flex>
          }
          data={tableContent.issues || []}
          columns={tableColumns}
          style={baseTableStyle}
        />
      </EntityInfoCard>
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
        <Flex justify="center" py="8">
          <Text>No issues found&nbsp;</Text>
        </Flex>
      }
      data={tableContent.issues || []}
      columns={tableColumns}
      style={{ ...baseTableStyle, ...style }}
    />
  );
};
