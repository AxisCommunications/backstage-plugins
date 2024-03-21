/**
 * A Backstage Jira Dashboard backend plugin that serves the Jira Dashboard frontend api
 *
 * @packageDocumentation
 */

export * from './service/router';
export { jiraDashboardPlugin as default } from './plugin';
export { searchJira } from './api';
export type { SearchOptions } from './api';
