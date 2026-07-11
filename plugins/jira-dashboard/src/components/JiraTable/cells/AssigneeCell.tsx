import { Avatar } from '@backstage/core-components';
import { Flex, Link, Text } from '@backstage/ui';
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
      <Flex
        direction="row"
        gap="2"
        align="center"
        data-testid="assignee-avatar"
      >
        <Avatar picture="" customStyles={{ width: 25, height: 25 }} />
        <Text variant="body-medium">Unassigned</Text>
      </Flex>
    );
  }

  const avatar = (
    <Flex direction="row" gap="2" align="center" data-testid="assignee-avatar">
      <Avatar
        picture={assignee.avatarUrls?.['48x48'] || ''}
        customStyles={{ width: 25, height: 25 }}
      />
      <Text truncate variant="body-medium">
        {assignee.displayName || assignee.name}
      </Text>
    </Flex>
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
          href={`/catalog/${entityRef.namespace}/${entityRef.kind}/${entityRef.name}`}
          standalone
        >
          {avatar}
        </Link>
      </EntityPeekAheadPopover>
    );
  }

  return avatar;
};
