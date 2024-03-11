# @axis-backstage/plugin-jira-dashboard

## 0.7.1

### Patch Changes

- ccae506: The scroll behavior on JiraTable have been set to auto, in order to only display the scrollbar if it is used. Otherwise, it is hidden.

## 0.7.0

### Minor Changes

- 33497c0: Dashboard and Avatar backend APIs adjusted to consume entityRef as /:kind/:namespace/:name. Fixes a 404 routing issue where a proxy like oauth2Proxy could decode the URI encoded path parameter /:entityRef known to contain the reserved path delimiter '/'.

## 0.6.2

### Patch Changes

- 050e48d: Replace all Mui Grid v1 with v2

## 0.6.1

### Patch Changes

- 0613d84: Updated the notes in the README.md about backend installation and setup in Jira Dashboard plugin and README plugin
- b445aaa: Update @mui & @emotion dependencies

## 0.6.0

### Minor Changes

- 97f5bf4: Created optional ANNOTATION_PREFIX config in backend to make it possible to define custom annotations. The jira.com annotation is still used if no config value is provided. Also removed check for annotation in frontend and only return error message 'Could not fetch Jira Dashboard content for defined project key' if no Jira data is returned from backend.

### Patch Changes

- Updated dependencies [97f5bf4]
  - @axis-backstage/plugin-jira-dashboard-common@0.4.0

## 0.5.0

### Minor Changes

- 08961a1: Bump to react v.18 in app and plugins, and updated dependencies. "peer" is now react 18 + 17. Removed react v. 16.13.1

## 0.4.0

### Minor Changes

- 864d983: Bumped Backstage version to v.1.22.0

### Patch Changes

- 27da24e: Added information about documentation and support to the SupportButton
- Updated dependencies [864d983]
  - @axis-backstage/plugin-jira-dashboard-common@0.3.0

## 0.3.0

### Minor Changes

- 23ff76a: Bumped Backstage version to v.1.21.0 in whole monorepo
- df948b1: Bumped Jira Dashboard frontend plugin to use Material UI v.5 components. Made necessary changes to the code.

### Patch Changes

- Updated dependencies [23ff76a]
  - @axis-backstage/plugin-jira-dashboard-common@0.2.0

## 0.2.0

### Minor Changes

- a67c963: Bumped Backstage to version 1.20.3

### Patch Changes

- 9cf5ab1: Added support for Jira Cloud by handling the case of missing category name or assignee name. Also added data to be able to test with Jira Cloud in standalone server.
- Updated dependencies [9cf5ab1]
  - @axis-backstage/plugin-jira-dashboard-common@0.1.1
