import React from 'react';
import { Grid } from '@mui/material';
import { StatusChip } from './StatusChip';
import { ComponentsTableProps } from './ComponentsTable';

export const ComponentGroupStatusChips = ({
  components,
}: ComponentsTableProps) => (
  <>
    {components.some(component => component.status !== 'operational') ? (
      components
        .filter(component => component.status !== 'operational')
        .map(component => (
          <Grid item key={component.id}>
            <StatusChip status={component.status} />
          </Grid>
        ))
    ) : (
      <Grid item>
        <StatusChip status="operational" />
      </Grid>
    )}
  </>
);
