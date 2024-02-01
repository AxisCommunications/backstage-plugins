import React from 'react';
import { Stack } from '@mui/material';
import { ComponentGroupCard } from './ComponentGroupCard';
import { Component, ComponentGroup } from '@axis-backstage/plugin-statuspage-common';

export type ComponentGroupListProps = {
  components: Component[];
  componentGroups: ComponentGroup[];
  expanded?: boolean;
};

export const ComponentGroupsList = ({
  components,
  componentGroups,
  expanded,
}: ComponentGroupListProps) => {
  return (
    <Stack paddingTop={'10px'}>
      {componentGroups.map(componentGroup => (
        <ComponentGroupCard
          key={componentGroup.id}
          componentGroup={componentGroup}
          components={components.filter(c => c.group_id === componentGroup.id)}
          expanded={expanded}
        />
      ))}
    </Stack>
  );
};
