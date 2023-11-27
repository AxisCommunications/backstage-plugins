import { createApiRef } from '@backstage/core-plugin-api';

export const readmeApiRef = createApiRef<ReadmeApi>({
  id: 'plugin.readme',
});

export type ReadmeApi = {
  getReadmeContent(entityRef: string): Promise<[string, string]>;
};
