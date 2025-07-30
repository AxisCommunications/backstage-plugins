import { Avatar, Link, OverflowTooltip } from '@backstage/core-components';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Issue } from '@axis-backstage/plugin-jira-dashboard-common';
import { EntityPeekAheadPopover } from '@backstage/plugin-catalog-react';
import React from 'react';

type Props = {
  assignee?: Issue['fields']['assignee'];
};

export const AssigneeCell = ({ assignee }: Props) => {
  if (assignee?.displayName) {
    return (
      <Stack direction="row" gap={1} alignItems="center" mb={1}>
        <Avatar
          picture={assignee.avatarUrls['48x48'] || ''}
          customStyles={{ width: 35, height: 35 }}
        />
        {assignee.key && assignee.key !== 'unassigned' ? (
          <EntityPeekAheadPopover entityRef={`user:default/${assignee.name}`}>
            <Link to={`/catalog/default/user/${assignee.name}`}>
              <OverflowTooltip text={assignee.displayName} />
            </Link>
          </EntityPeekAheadPopover>
        ) : (
          <Typography variant="body2">{assignee.displayName}</Typography>
        )}
      </Stack>
    );
  } else if (assignee?.name) {
    return (
      <Typography variant="body2">{assignee.name.split('@')[0]}</Typography>
    );
  } else if (assignee?.key) {
    return <Typography variant="body2">{assignee.key}</Typography>;
  }

  return (
    <Typography
      sx={{ color: theme => theme.palette.text.disabled }}
      variant="body2"
    />
  );
};
