import React from 'react';
import Chip from '@mui/material/Chip';
import type { ComponentStatus } from '@axis-backstage/plugin-statuspage-common';

/**
 * Maps statuspage component statuses to MUI colors.
 *
 */
const statusColorMap: { [key in ComponentStatus]: string } = {
  under_maintenance: 'info',
  operational: 'success',
  degraded_performance: 'warning',
  partial_outage: 'warning',
  major_outage: 'error',
};

type StatusChipProps = {
  status: ComponentStatus;
};

const formatStatusString = (status: string): string =>
  status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

export const StatusChip = ({ status }: StatusChipProps) => (
  <Chip
    sx={{ margin: '0 8px' }}
    size="small"
    label={formatStatusString(status)}
    color={statusColorMap[status] || ('default' as any)}
  />
);
