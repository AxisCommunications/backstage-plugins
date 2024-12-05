/**
 * A Backstage Jira Dashboard backend plugin that serves the Jira Dashboard frontend api
 *
 * @packageDocumentation
 */

export { jiraDashboardPlugin as default } from './plugin';
export { searchJira, callApi } from './api';
export type { SearchOptions } from './api';
export type { ConfigInstance } from './config';
export { JiraConfig } from './config';
export { jqlQueryBuilder } from './queries';
export type { JqlQueryBuilderArgs } from './queries';
