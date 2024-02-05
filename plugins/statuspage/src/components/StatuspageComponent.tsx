import React from 'react';
import {
  InfoCard,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import type { ComponentStatus } from '@axis-backstage/plugin-statuspage-common';
import { ComponentGroupsList } from './ComponentGroupsList';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useComponents } from '../hooks/useComponents';

/**
 * StatuspageComponent props.
 *
 * @public
 */
export type StatuspageProps = {
  name: string;
};

/**
 * Maps statuspage component statuses to MUI colors.
 *
 * @public
 */
export const statusColorMap: { [key in ComponentStatus]: string } = {
  under_maintenance: 'info',
  operational: 'success',
  degraded_performance: 'warning',
  partial_outage: 'warning',
  major_outage: 'error',
};

/**
 * Visualizes a full statuspage.
 *
 * @param name - instance name from app config.
 * @public
 */
export const StatuspageComponent = ({ name }: StatuspageProps) => {
  const { loading, error, value } = useComponents(name);

  if (loading) {
    return <Progress />;
  }
  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const linkAction = value?.url && (
    <IconButton
      aria-label="Go to our statuspage"
      role="button"
      title="Go to statuspage(.io)"
      href={value?.url}
      target="_blank"
    >
      <OpenInNewIcon />
    </IconButton>
  );

  return (
    <InfoCard title="Status of our services" action={linkAction}>
      <ComponentGroupsList
        components={value?.components || []}
        componentGroups={value?.componentGroups || []}
      />
    </InfoCard>
  );
};
