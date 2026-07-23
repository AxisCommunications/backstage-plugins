import {
  DEFAULT_NAMESPACE,
  Entity,
  UserEntity,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { CatalogApi } from '@backstage/plugin-catalog-react';

const MANAGER_ANNOTATION = 'manager';
const CATALOG_PAGE_SIZE = 500;

const fetchAllUserEntities = async (
  catalogApi: CatalogApi,
  filter: Record<string, string | string[]>,
) => {
  const users: UserEntity[] = [];
  let cursor: string | undefined;

  do {
    const response = await catalogApi.queryEntities(
      cursor
        ? { cursor, limit: CATALOG_PAGE_SIZE }
        : { filter, limit: CATALOG_PAGE_SIZE, totalItems: 'exclude' },
    );

    users.push(...(response.items as UserEntity[]));
    cursor = response.pageInfo.nextCursor;
  } while (cursor);

  return users;
};

export const fetchUserEntities = async (
  catalogApi: CatalogApi,
  entity: Entity,
) => {
  if (!entity.metadata?.annotations?.[MANAGER_ANNOTATION]) {
    return [entity as UserEntity];
  }

  const filter = {
    kind: 'User',
    [`metadata.annotations.${MANAGER_ANNOTATION}`]:
      entity.metadata.annotations[MANAGER_ANNOTATION],
  };

  return fetchAllUserEntities(catalogApi, filter);
};

export const fetchGroupEntities = async (
  catalogApi: CatalogApi,
  entity: Entity,
) => {
  const {
    metadata: { name: groupName, namespace = DEFAULT_NAMESPACE },
  } = entity;

  const filter = {
    kind: 'User',
    'relations.memberof': [
      stringifyEntityRef({
        kind: 'group',
        namespace: namespace.toLocaleLowerCase('en-US'),
        name: groupName.toLocaleLowerCase('en-US'),
      }),
    ],
  };

  return fetchAllUserEntities(catalogApi, filter);
};
