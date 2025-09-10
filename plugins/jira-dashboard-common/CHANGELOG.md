# @axis-backstage/plugin-jira-dashboard-common

## 1.14.1

### Patch Changes

- 276e489: Fix for the Jira dashboard plugin when an assignee has no name field.

## 1.14.0

### Minor Changes

- db452c4: Updated to Backstage v1.42.5

## 1.13.0

### Minor Changes

- 70256ff: Add jql annotation to the Jira plugins to allow fully customization of the issues displayed in the Jira Dashboard

## 1.12.0

### Minor Changes

- 86c01b7: Bumped to Backstage 1.40

## 1.11.0

### Minor Changes

- 15f1ee8: Support Multiple Jira Project Cards in Tabbed View

## 1.10.0

### Minor Changes

- ede8341: Updated to Backstage v1.36.1.

## 1.9.1

### Patch Changes

- 060bcf6: Set issues field as optional in JiraResponse

## 1.9.0

### Minor Changes

- 18fba21: Add support for multiple Jira instances
- 18fba21: Introduced TypeScript type definitions SearchJiraResponse and JiraQueryResults to represent Jira search responses and pagination details.
  Updated the searchJira function to return search results as a SearchJiraResponse, incorporating the new types.
  The searchJira function now returns an object containing both the search results and the HTTP status code, improving error resilience and clarity in handling search operations.
  The JiraQueryResults type outlines the structure of a paginated Jira search response, facilitating better data handling.
  These changes streamline the Jira Dashboard plugin's codebase, improving error resilience and clarity in handling search operations.

## 1.8.0

### Minor Changes

- 39b1dbf: Add support for multiple Jira instances

## 1.7.0

### Minor Changes

- d3129c0: Adding jql query to support links within JiraTable title

## 1.6.0

### Minor Changes

- 9bc46fc: New component - JiraUserIssuesCardView - listing user issues view for current logged user

## 1.5.0

### Minor Changes

- 6fd284d: Updated to Backstage v1.30.1.

## 1.4.0

### Minor Changes

- 0b948ea: Generate pluginIds for plugins and bumping @backstage/cli

## 1.3.0

### Minor Changes

- e416aff: Adding Priority Column to the Jira Table

## 1.2.0

### Minor Changes

- 916589b: Bumped Backstage to v.27.7 and removed the TechRadar plugin since it was not used and caused problems with the new version.

## 1.1.0

### Minor Changes

- 0ec1f12: Created the incoming-issues-annotation to make it possible for users to define Jira status for Incoming issues other than "New". Made some smaller refactoring in filter.ts to create better consistency among functions.

## 1.0.1

### Patch Changes

- 0535af4: Bumped backstage dependencies to match 1.26.0

## 1.0.0

### Major Changes

- 517c68a: Update default project lead name from 'key' to 'displayName' for clarity and consistency Additionally, this commit introduces provisions for displaying the image of the assignee, enhancing the user interface and providing visual context alongside the assignee's display name.

## 0.4.0

### Minor Changes

- 97f5bf4: Created optional ANNOTATION_PREFIX config in backend to make it possible to define custom annotations. The jira.com annotation is still used if no config value is provided. Also removed check for annotation in frontend and only return error message 'Could not fetch Jira Dashboard content for defined project key' if no Jira data is returned from backend.

## 0.3.0

### Minor Changes

- 864d983: Bumped Backstage version to v.1.22.0

## 0.2.0

### Minor Changes

- 23ff76a: Bumped Backstage version to v.1.21.0 in whole monorepo

## 0.1.1

### Patch Changes

- 9cf5ab1: Added support for Jira Cloud by handling the case of missing category name or assignee name. Also added data to be able to test with Jira Cloud in standalone server.
