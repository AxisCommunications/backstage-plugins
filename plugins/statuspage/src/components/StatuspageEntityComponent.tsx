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
} from '@axis-backstage/plugin-statuspage-common';
import { statuspageApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ComponentsTable } from './ComponentsTable';
import { ComponentGroupsList } from './ComponentGroupsList';
import { IconButton, Typography } from '@mui/material';
import { STATUSPAGE_ANNOTATION } from '@axis-backstage/plugin-statuspage-common';

/**
 * Statuspage card intended for the EntityPage. Allows embedding of specific
 * statuspage components and component groups.
 *
 * @public
 */
export const StatuspageEntityComponent = () => {
  const statuspageApi = useApi(statuspageApiRef);
  const { entity } = useEntity();
  const componentsStr = entity.metadata.annotations?.[STATUSPAGE_ANNOTATION];
  if (!componentsStr) {
    return null;
  }
  const [name, wantedComponentsStr] = componentsStr.split(':');
  const wantedComponents = wantedComponentsStr?.split(',').map(it => it.trim());

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

  const fullStatuspage = !wantedComponents;
  const filteredComponents =
    value?.components.filter(
      c => !fullStatuspage && !c.group && wantedComponents.includes(c.id),
    ) || [];
  const filteredComponentGroups =
    value?.componentGroups.filter(
      c => fullStatuspage || wantedComponents.includes(c.id),
    ) || [];
  const noComponents =
    (!filteredComponents || filteredComponentGroups.length == 0) &&
    filteredComponents &&
    filteredComponents.length == 0;

  if (noComponents) {
    return (
      <InfoCard title="Service Status" action={linkAction}>
        <Typography variant="body2" color={'#FF5555'}>
          The specified statuspage.io components could not be found. Check your
          annotation.
        </Typography>
      </InfoCard>
    );
  }
  return (
    <InfoCard title="Service Status" action={linkAction}>
      {filteredComponents && filteredComponents.length > 0 && (
        <ComponentsTable components={filteredComponents} />
      )}
      {filteredComponentGroups && filteredComponentGroups.length > 0 && (
        <ComponentGroupsList
          components={value?.components || []}
          componentGroups={filteredComponentGroups}
          expanded={!fullStatuspage}
        />
      )}
    </InfoCard>
  );
};
