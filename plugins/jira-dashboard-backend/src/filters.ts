import { Config } from '@backstage/config';
import { resolveUserEmailSuffix } from './config';
import { Filter } from '@axis-backstage/plugin-jira-dashboard-common';
import { UserEntity } from '@backstage/catalog-model';

const openFilter: Filter = {
  name: 'Open Issues',
  shortName: 'OPEN',
  query: 'resolution = Unresolved ORDER BY updated DESC',
};

const getIncomingFilter = (incomingStatus: string): Filter => ({
  name: 'Incoming Issues',
  shortName: 'INCOMING',
  query: `status = ${incomingStatus} ORDER BY created ASC`,
});

const getUserEmail = (
  userEntity: UserEntity,
  config: Config,
): string | undefined => {
  const emailSuffixConfig = resolveUserEmailSuffix(config);

  return emailSuffixConfig
    ? `${userEntity.metadata.name}${emailSuffixConfig}`
    : userEntity.spec?.profile?.email;
};

export const getDefaultFiltersForUser = (
  config: Config,
  userEntity?: UserEntity,
  incomingStatus?: string,
): Filter[] => {
  const incomingFilter = getIncomingFilter(incomingStatus ?? 'New');

  if (!userEntity) return [openFilter, incomingFilter];

  return [
    openFilter,
    incomingFilter,
    {
      name: 'Assigned to me',
      shortName: 'ME',
      query: `assignee = "${getUserEmail(
        userEntity,
        config,
      )}" AND resolution = Unresolved ORDER BY updated DESC`,
    },
  ];
};
