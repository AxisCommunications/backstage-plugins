import {
  InfoCard,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ComponentsTable } from './ComponentsTable';
import { ComponentGroupsList } from './ComponentGroupsList';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { STATUSPAGE_ANNOTATION } from '@axis-backstage/plugin-statuspage-common';
import { useComponents } from '../hooks/useComponents';

/**
 * Statuspage card intended for the EntityPage. Allows embedding of specific
 * statuspage components and component groups.
 *
 * @public
 */
export const StatuspageEntityCard = () => {
  const { entity } = useEntity();
  const [name, wantedComponentsStr] =
    entity.metadata.annotations?.[STATUSPAGE_ANNOTATION]?.split(':')!;
  const wantedComponents = wantedComponentsStr?.split(',').map(it => it.trim());

  const { loading, error, value } = useComponents(name);

  if (loading) {
    return <Progress />;
  }
  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

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
    (!filteredComponents || filteredComponentGroups.length === 0) &&
    filteredComponents &&
    filteredComponents.length === 0;

  if (noComponents) {
    return (
      <InfoCard title="Service Status" action={linkAction}>
        <Typography variant="body2" color="#FF5555">
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
