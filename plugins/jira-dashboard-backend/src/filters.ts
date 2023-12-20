import { resolveUserEmailSuffix } from './config';
import { Filter } from '@axis-backstage/plugin-jira-dashboard-common';
import { Config } from '@backstage/config';

const getUsernameFromRef = (userRef: string) => {
  return userRef?.split('/').slice(1)[0];
};

const openFilter: Filter = {
  name: 'Open Issues',
  shortName: 'OPEN',
  query: 'resolution = Unresolved ORDER BY updated DESC',
};

const incomingFilter: Filter = {
  name: 'Incoming Issues',
  shortName: 'INCOMING',
  query: 'status = New ORDER BY created ASC',
};

export const getDefaultFilters = (
  config: Config,
  userRef?: string,
): Filter[] => {
  if (!userRef) {
    return [openFilter, incomingFilter];
  }
  const username = getUsernameFromRef(userRef);

  if (!username) {
    return [openFilter, incomingFilter];
  }

  const assignedToMeFilter: Filter = {
    name: 'Assigned to me',
    shortName: 'ME',
    query: `assignee = "${username}${resolveUserEmailSuffix(
      config,
    )}" AND resolution = Unresolved ORDER BY updated DESC`,
  };

  return [openFilter, incomingFilter, assignedToMeFilter];
};
