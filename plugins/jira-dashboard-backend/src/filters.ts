import { RootConfigService } from '@backstage/backend-plugin-api';
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

/**
 * Get the username value for Jira assignee from the user entity.
 * If the email suffix is defined, the result combines `metadata.name` with the email suffix - otherwise if the user entity has a profile email or the metadata name is used.
 * Otherwise, the user entity name will be used.
 * @param config appConfig configuration
 * @param userEntity user entity instance
 */
export const getAssigneUser = (
  config: RootConfigService,
  userEntity: UserEntity,
): string => {
  const emailSuffixConfig = resolveUserEmailSuffix(config);

  return emailSuffixConfig
    ? `${userEntity.metadata.name}${emailSuffixConfig}`
    : userEntity.spec?.profile?.email || userEntity.metadata.name;
};

const getAssignedToMeFilter = (
  userEntity: UserEntity,
  config: RootConfigService,
): Filter => {
  const email = getAssigneUser(config, userEntity);

  return {
    name: 'Assigned to me',
    shortName: 'ME',
    query: `assignee = "${email}" AND resolution = Unresolved ORDER BY updated DESC`,
  };
};

export const getDefaultFiltersForUser = (
  config: RootConfigService,
  userEntity?: UserEntity,
  incomingStatus?: string,
): Filter[] => {
  const incomingFilter = getIncomingFilter(incomingStatus ?? 'New');

  if (!userEntity) return [openFilter, incomingFilter];

  const assigneeToMeFilter = getAssignedToMeFilter(userEntity, config);

  return [openFilter, incomingFilter, assigneeToMeFilter];
};
