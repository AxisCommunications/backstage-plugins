import { Avatar, Link } from '@backstage/core-components';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Issue } from '@axis-backstage/plugin-jira-dashboard-common';
import { EntityPeekAheadPopover } from '@backstage/plugin-catalog-react';

type Props = {
  assignee?: Issue['fields']['assignee'];
};

export const AssigneeCell = ({ assignee }: Props) => {
  if (!assignee) {
    return null;
  }

  const username =
    assignee.displayName || assignee.name?.split('@')[0] || assignee.key;

  if (!username || username === 'Unassigned') {
    return (
      <Stack direction="row" gap={1} alignItems="center">
        <Avatar picture="" customStyles={{ width: 35, height: 35 }} />
        <Typography variant="body2">Unassigned</Typography>
      </Stack>
    );
  }

  return (
    <EntityPeekAheadPopover entityRef={`user:default/${assignee.name}`}>
      <Link to={`/catalog/default/user/${username}`}>
        <Stack direction="row" gap={1} alignItems="center">
          <Avatar
            picture={assignee.avatarUrls?.['48x48'] || ''}
            customStyles={{ width: 35, height: 35 }}
          />
          <Typography noWrap>{username}</Typography>
        </Stack>
      </Link>
    </EntityPeekAheadPopover>
  );
};
