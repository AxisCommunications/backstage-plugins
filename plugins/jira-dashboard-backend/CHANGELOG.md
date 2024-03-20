# @axis-backstage/plugin-jira-dashboard-backend

## 0.7.1

### Patch Changes

- ae965c0: Fix broken workspace dependencies

## 0.7.0

### Minor Changes

- 135e3b2: Updated the resolveUserEmailSuffix function to utilize config.getOptionalString method, providing a more concise approach. This modification ensures that an empty string is returned if the Jira user email suffix configuration is missing, effectively preventing failures and enhancing error logging capabilities.

  Modified the retrieval of project keys in the router module to handle multiple project keys specified in annotations for e.g., jira.com/project-key: abc,def,ghi
  The updated logic now parses multiple project keys properly and supports comma-separated values. It's important to note that in cases where multiple project keys are present, only the first project key (projectKey[0]) is used for display on the project card i.e, in this case project-key "abc", assuming it represents the main project. However, the response table will include data from all project keys specified in the annotations.

## 0.6.0

### Minor Changes

- 33497c0: Dashboard and Avatar backend APIs adjusted to consume entityRef as /:kind/:namespace/:name. Fixes a 404 routing issue where a proxy like oauth2Proxy could decode the URI encoded path parameter /:entityRef known to contain the reserved path delimiter '/'.

### Patch Changes

- d45e6cb: The Jira Dashboard backend now also looks for the `/component`-annotation, in order to support Roadies annotation.
- 3adbfd1: Fix inaccuracy in config documentation in README.md

## 0.5.0

### Minor Changes

- 97f5bf4: Created optional ANNOTATION_PREFIX config in backend to make it possible to define custom annotations. The jira.com annotation is still used if no config value is provided. Also removed check for annotation in frontend and only return error message 'Could not fetch Jira Dashboard content for defined project key' if no Jira data is returned from backend.

### Patch Changes

- Updated dependencies [97f5bf4]
  - @axis-backstage/plugin-jira-dashboard-common@0.4.0

## 0.4.0

### Minor Changes

- 864d983: Bumped Backstage version to v.1.22.0

### Patch Changes

- 1248d02: Removed the single quotes from documentation config strings
- Updated dependencies [864d983]
  - @axis-backstage/plugin-jira-dashboard-common@0.3.0

## 0.3.0

### Minor Changes

- 23ff76a: Bumped Backstage version to v.1.21.0 in whole monorepo

### Patch Changes

- Updated dependencies [23ff76a]
  - @axis-backstage/plugin-jira-dashboard-common@0.2.0

## 0.2.0

### Minor Changes

- a67c963: Bumped Backstage to version 1.20.3

### Patch Changes

- 1e7ee53: Added missing config.d.ts file to package.json
- Updated dependencies [9cf5ab1]
  - @axis-backstage/plugin-jira-dashboard-common@0.1.1
