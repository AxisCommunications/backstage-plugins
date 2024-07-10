# @axis-backstage/plugin-jira-dashboard

## 1.3.0

### Minor Changes

- e416aff: Adding Priority Column to the Jira Table

### Patch Changes

- Updated dependencies [e416aff]
  - @axis-backstage/plugin-jira-dashboard-common@1.3.0

## 1.2.0

### Minor Changes

- 916589b: Bumped Backstage to v.27.7 and removed the TechRadar plugin since it was not used and caused problems with the new version.

### Patch Changes

- Updated dependencies [916589b]
  - @axis-backstage/plugin-jira-dashboard-common@1.2.0

## 1.1.0

### Minor Changes

- 0ec1f12: Created the incoming-issues-annotation to make it possible for users to define Jira status for Incoming issues other than "New". Made some smaller refactoring in filter.ts to create better consistency among functions.

### Patch Changes

- Updated dependencies [0ec1f12]
  - @axis-backstage/plugin-jira-dashboard-common@1.1.0

## 1.0.2

### Patch Changes

- 0535af4: Bumped backstage dependencies to match 1.26.0
- Updated dependencies [0535af4]
  - @axis-backstage/plugin-jira-dashboard-common@1.0.1

## 1.0.1

### Patch Changes

- 12f407b: Changed assignee font size in JiraTable to 14px so it would match the other text in the component.

## 1.0.0

### Major Changes

- 517c68a: Update default project lead name from 'key' to 'displayName' for clarity and consistency Additionally, this commit introduces provisions for displaying the image of the assignee, enhancing the user interface and providing visual context alongside the assignee's display name.

### Patch Changes

- 5457a70: Added the url pathname as part of the base URL for all links to Jira. This because Jira Server have additional path in the Jira base URl and links were broken.
- Updated dependencies [517c68a]
  - @axis-backstage/plugin-jira-dashboard-common@1.0.0

## 0.7.4

### Patch Changes

- f3203e9: Fix dependencies in published packages

## 0.7.3

### Patch Changes

- c108b55: Refactor: Update default project lead name from 'key' to 'displayName' for clarity and consistency.

## 0.7.2

### Patch Changes

- ae965c0: Fix broken workspace dependencies

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
