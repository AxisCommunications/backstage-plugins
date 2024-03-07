import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { ComponentsTableProps } from './ComponentsTable';
import { StatusChip } from './StatusChip';

export const ComponentGroupStatusChips = ({
  components,
}: ComponentsTableProps) => (
  <>
    {components.some(component => component.status !== 'operational') ? (
      components
        .filter(component => component.status !== 'operational')
        .map(component => (
          <Grid padding={0} alignSelf="center" key={component.id}>
            <StatusChip status={component.status} />
          </Grid>
        ))
    ) : (
      <Grid padding={0} alignSelf="center">
        <StatusChip status="operational" />
      </Grid>
    )}
  </>
);
