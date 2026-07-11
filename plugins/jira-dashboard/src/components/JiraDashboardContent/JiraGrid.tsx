import { Grid } from '@backstage/ui';
import { JiraProjectCard } from '../JiraProjectCard';
import { JiraTable } from '../JiraTable';
import {
  JiraDataResponse,
  Project,
  Issue,
} from '@axis-backstage/plugin-jira-dashboard-common';
import { TableFilter, TableOptions } from '@backstage/core-components';

interface JiraGridProps {
  project: Project;
  tableData: JiraDataResponse[];
  showFilters?: TableFilter[] | boolean;
  tableOptions?: TableOptions<Issue>;
}

export const JiraGrid = ({
  project,
  tableData,
  showFilters,
  tableOptions,
}: JiraGridProps) => {
  return (
    <Grid.Root columns="12" gap="6" style={{ width: '100%' }}>
      <Grid.Item
        colSpan={{ initial: '12', xl: '6' }}
        data-testid="project-card"
      >
        <JiraProjectCard project={project} />
      </Grid.Item>
      {tableData.map((value: JiraDataResponse) => (
        <Grid.Item
          colSpan={{ initial: '12', xl: '6' }}
          key={value.name}
          data-testid="issue-table"
        >
          <JiraTable
            tableContent={value}
            showFilters={showFilters}
            project={project}
            tableOptions={tableOptions}
            tableStyle={{
              width: '100%',
              height: 'max-content',
              maxHeight: '500px',
              padding: '20px',
              overflowY: 'auto',
            }}
          />
        </Grid.Item>
      ))}
    </Grid.Root>
  );
};
