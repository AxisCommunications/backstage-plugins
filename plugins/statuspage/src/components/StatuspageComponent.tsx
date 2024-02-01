import React from 'react';
import {
  InfoCard,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import type {
  Component,
  ComponentGroup,
  ComponentStatus,
} from '@axis-backstage/plugin-statuspage-common';
import { statuspageApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';
import { ComponentGroupsList } from './ComponentGroupsList';
import { IconButton } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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
  const statuspageApi = useApi(statuspageApiRef);

  const { value, loading, error } = useAsync(async (): Promise<{
    components: Component[];
    componentGroups: ComponentGroup[];
    url?: string;
  }> => {
    const components = await statuspageApi.getComponents(name);
    const componentGroups = await statuspageApi.getComponentGroups(name);
    const { url } = await statuspageApi.getLink(name);
    return {
      components,
      componentGroups,
      url,
    };
  }, [name]);

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
