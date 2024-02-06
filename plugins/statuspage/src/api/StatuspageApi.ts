import { createApiRef } from '@backstage/core-plugin-api';

import type {
  Component,
  ComponentGroup,
} from '@axis-backstage/plugin-statuspage-common';

export type StatuspageApi = {
  getComponents(name: string): Promise<Component[]>;
  getComponentGroups(name: string): Promise<ComponentGroup[]>;
  getLink(name: string): Promise<{ url: string }>;
};

export const statuspageApiRef = createApiRef<StatuspageApi>({
  id: 'plugin.statuspage',
});
