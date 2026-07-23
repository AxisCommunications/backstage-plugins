import { Entity, UserEntity } from '@backstage/catalog-model';
import { CatalogApi } from '@backstage/plugin-catalog-react';
import { fetchUserEntities } from './fetch';

const makeUser = (name: string): UserEntity => ({
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: { name },
  spec: { profile: {}, memberOf: [] },
});

describe('fetchUserEntities', () => {
  it('fetches every cursor page for a manager', async () => {
    const queryEntities = jest
      .fn()
      .mockResolvedValueOnce({
        items: [makeUser('alice')],
        totalItems: 2,
        pageInfo: { nextCursor: 'next-page' },
      })
      .mockResolvedValueOnce({
        items: [makeUser('bob')],
        totalItems: 2,
        pageInfo: {},
      });
    const catalogApi = { queryEntities } as unknown as CatalogApi;
    const manager: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        name: 'manager',
        annotations: { manager: 'bossman' },
      },
      spec: {},
    };

    const users = await fetchUserEntities(catalogApi, manager);

    expect(users.map(user => user.metadata.name)).toEqual(['alice', 'bob']);
    expect(queryEntities).toHaveBeenNthCalledWith(1, {
      filter: {
        kind: 'User',
        'metadata.annotations.manager': 'bossman',
      },
      limit: 500,
      totalItems: 'exclude',
    });
    expect(queryEntities).toHaveBeenNthCalledWith(2, {
      cursor: 'next-page',
      limit: 500,
    });
  });
});
