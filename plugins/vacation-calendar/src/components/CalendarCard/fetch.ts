import {
  DEFAULT_NAMESPACE,
  Entity,
  UserEntity,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { CatalogApi } from '@backstage/plugin-catalog-react';

const MANAGER_ANNOTATION = 'manager';

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

  const { items } = await catalogApi.getEntities({ filter });
  return items as UserEntity[];
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

  return (await catalogApi.getEntities({ filter })).items as UserEntity[];
};
