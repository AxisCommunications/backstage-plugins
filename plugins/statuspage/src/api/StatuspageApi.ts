import { createApiRef } from '@backstage/core-plugin-api';

import type {
  Component,
  ComponentGroup,
} from '@axis-backstage/plugin-statuspage-common';

/**
 * The definition for the statuspage api.
 *
 * @public
 */
export type StatuspageApi = {
  getComponents(name: string): Promise<Component[]>;
  getComponentGroups(name: string): Promise<ComponentGroup[]>;
  getLink(name: string): Promise<{ url: string }>;
};

/**
 * The apiref for the statuspage plugin.
 *
 * @public
 */
export const statuspageApiRef = createApiRef<StatuspageApi>({
  id: 'plugin.statuspage',
});
