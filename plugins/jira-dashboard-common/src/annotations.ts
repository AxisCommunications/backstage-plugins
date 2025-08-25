/**
 * The annotation name used to provide the key of the Jira project to track for this entity
 *
 * If this project is not in the default Jira instance, it can be prefixed with
 * `instance-name/`.
 *
 *  @public
 */
export const PROJECT_KEY_NAME = 'project-key';

/**
 * The annotation name used to provide a JQL query to filter issues for this entity
 *  @public
 */
export const JQL = 'jql';

/**
 * The annotation name used to provide the Jira components to track for this entity
 *  @public
 */
export const COMPONENTS_NAME = 'components';

/**
 * The annotation name used to provide the Jira filter ids to track for this entity
 *  @public
 */
export const FILTERS_NAME = 'filter-ids';

/**
 * The annotation name used to provide the status for incoming issues in Jira
 *  @public
 */
export const INCOMING_ISSUES_STATUS = 'incoming-issues-status';
