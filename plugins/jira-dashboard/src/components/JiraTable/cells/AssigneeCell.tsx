import { Avatar, Link } from '@backstage/core-components';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Issue } from '@axis-backstage/plugin-jira-dashboard-common';
import { EntityPeekAheadPopover } from '@backstage/plugin-catalog-react';
import { stringifyEntityRef } from '@backstage/catalog-model';

type Props = {
  assignee?: Issue['fields']['assignee'];
};

const normalizeAssigneeName = (name: string): string => {
  if (!name) return '';
  if (name.includes('@')) {
    return name.split('@')[0];
  }
  return name;
};
export const AssigneeCell = ({ assignee }: Props) => {
  if (!assignee) {
    return null;
  }

  const name = assignee.name || assignee.displayName;
  if (!name || name.toLowerCase() === 'unassigned') {
    return (
      <Stack
        direction="row"
        gap={1}
        alignItems="center"
        data-testid="assignee-avatar"
      >
        <Avatar picture="" customStyles={{ width: 25, height: 25 }} />
        <Typography variant="body2">Unassigned</Typography>
      </Stack>
    );
  }

  const avatar = (
    <Stack
      direction="row"
      gap={1}
      alignItems="center"
      data-testid="assignee-avatar"
    >
      <Avatar
        picture={assignee.avatarUrls?.['48x48'] || ''}
        customStyles={{ width: 25, height: 25 }}
      />
      <Typography noWrap variant="body2">
        {assignee.displayName || assignee.name}
      </Typography>
    </Stack>
  );

  if (assignee.name) {
    const entityRef = {
      kind: 'user',
      namespace: 'default',
      name: normalizeAssigneeName(assignee.name),
    };

    return (
      <EntityPeekAheadPopover entityRef={stringifyEntityRef(entityRef)}>
        <Link
          to={`/catalog/${entityRef.namespace}/${entityRef.kind}/${entityRef.name}`}
        >
          {avatar}
        </Link>
      </EntityPeekAheadPopover>
    );
  }

  return avatar;
};
