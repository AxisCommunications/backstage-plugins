import React from 'react';
import type { ComponentStatus } from '@axis-backstage/plugin-statuspage-common';
import { Chip } from '@mui/material';
import { statusColorMap } from './StatuspageComponent';

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
