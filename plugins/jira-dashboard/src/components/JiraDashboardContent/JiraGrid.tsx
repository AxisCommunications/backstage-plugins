import Grid from '@mui/material/Grid';
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
    <Grid container spacing={3} style={{ width: '100%' }}>
      <Grid
        item
        xs={12}
        xl={6}
        data-testid="project-card"
        style={{ paddingTop: '24px', paddingLeft: '24px' }}
      >
        <JiraProjectCard project={project} />
      </Grid>
      {tableData.map((value: JiraDataResponse) => (
        <Grid
          item
          xs={12}
          xl={6}
          key={value.name}
          data-testid="issue-table"
          style={{ paddingTop: '24px', paddingLeft: '24px' }}
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
        </Grid>
      ))}
    </Grid>
  );
};
