# @axis-backstage/plugin-jira-dashboard-common

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
