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

const getAssignedToMeFilter = (
  userEntity: UserEntity,
  config: Config,
): Filter => {
  const emailSuffixConfig = resolveUserEmailSuffix(config);

  const email = emailSuffixConfig
    ? `${userEntity.metadata.name}${emailSuffixConfig}`
    : userEntity.spec?.profile?.email;

  return {
    name: 'Assigned to me',
    shortName: 'ME',
    query: `assignee = "${email}" AND resolution = Unresolved ORDER BY updated DESC`,
  };
};

export const getDefaultFiltersForUser = (
  config: Config,
  userEntity?: UserEntity,
  incomingStatus?: string,
): Filter[] => {
  const incomingFilter = getIncomingFilter(incomingStatus ?? 'New');

  if (!userEntity) return [openFilter, incomingFilter];

  const assigneeToMeFilter = getAssignedToMeFilter(userEntity, config);

  return [openFilter, incomingFilter, assigneeToMeFilter];
};
