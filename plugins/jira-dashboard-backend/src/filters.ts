import { Config } from '@backstage/config';
import { resolveUserEmailSuffix, resolveJiraFilters } from './config';
import { Filter } from '@axis-backstage/plugin-jira-dashboard-common';

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
  const jiraUser = `${username}${resolveUserEmailSuffix(config)}`;
  const defaultFiltersConfig: Config[] | undefined = resolveJiraFilters(config);

  if (defaultFiltersConfig) {
    const filterArray: Filter[] = [];
    for (const filter of defaultFiltersConfig) {
      const filterOnUser = filter.getOptionalBoolean('filterOnUser')
        ? `(assignee = ${jiraUser} OR "Additional Assignees" in (${jiraUser})) AND `
        : '';
      const jiraFilter: Filter = {
        name: filter.getString('name'),
        query: `${filterOnUser} ${filter.getString('query')}`,
        shortName: filter.getString('shortName'),
      };
      filterArray.push(jiraFilter);
    }
    return filterArray;
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
