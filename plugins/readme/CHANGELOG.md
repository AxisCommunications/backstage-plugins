# @axis-backstage/plugin-readme

## 0.18.1

### Patch Changes

- 199bd49: Fix critical security vulnerabilities by upgrading Backstage dependencies:

  **Security Fixes:**

  - Fixed CVE-2025-8101 (High Severity) in linkifyjs/linkify-react by upgrading @backstage/core-components from ^0.18.4 to ^0.18.6
  - Fixed CVE-2026-24046 (High Severity) - UNIX Symbolic Link Following in @backstage/backend-plugin-api by upgrading from ^1.6.0 to ^1.6.2
  - Fixed CVE-2026-24047 (High Severity) - Symlink Attack in @backstage/backend-defaults by upgrading from ^0.14.0 to ^0.15.1
  - Fixed SNYK-JS-QS-14724253 (High Severity) - Allocation of Resources Without Limits or Throttling in qs by adding resolution to ^6.14.1

  **Additional Package Upgrades:**
  Upgraded packages to versions that depend on patched Backstage core packages:

  - @backstage/plugin-mcp-actions-backend: ^0.1.6 → ^0.1.8
  - @backstage/plugin-search-backend: ^2.0.9 → ^2.0.11
  - @backstage/plugin-techdocs-backend: ^2.1.3 → ^2.1.4
  - @backstage/backend-test-utils: ^1.10.2 → ^1.10.4 (in jira-dashboard-backend and readme-backend)

  **Code Improvements:**

  - Removed redundant @backstage/backend-defaults imports from production code paths in backend plugins (jira-dashboard-backend, readme-backend, statuspage-backend)

## 0.18.0

### Minor Changes

- 7d98ad2: Bumped to backstage 1.46.2

## 0.17.0

### Minor Changes

- 798d14d: Added support for new frontend system

## 0.16.0

### Minor Changes

- db452c4: Updated to Backstage v1.42.5

## 0.15.0

### Minor Changes

- 2a2afb8: Add URL state management and update fullscreen icon

## 0.14.0

### Minor Changes

- 86c01b7: Bumped to Backstage 1.40

## 0.13.0

### Minor Changes

- ede8341: Updated to Backstage v1.36.1.

## 0.12.0

### Minor Changes

- 0726c03: Created the isReadmeAvailable function that returns false if no README content is found due to 404-error. If it returns false, no ReadmeCard is rendered in EntityPage. Also updated the error response from backend to be a NotFoundError.

## 0.11.0

### Minor Changes

- 3d15d61: Add new maxHeight property to ReadmeCard component

## 0.10.0

### Minor Changes

- 6fd284d: Updated to Backstage v1.30.1.

## 0.9.0

### Minor Changes

- 0b948ea: Generate pluginIds for plugins and bumping @backstage/cli

## 0.8.0

### Minor Changes

- 916589b: Bumped Backstage to v.27.7 and removed the TechRadar plugin since it was not used and caused problems with the new version.

## 0.7.1

### Patch Changes

- 0535af4: Bumped backstage dependencies to match 1.26.0

## 0.7.0

### Minor Changes

- 371f5fd: Readme backend APIs adjusted to consume entityRef as /:kind/:namespace/:name. Fixes a 404 routing issue where a proxy like oauth2Proxy could decode the URI encoded path parameter /:entityRef known to contain the reserved path delimiter '/'.

## 0.6.0

### Minor Changes

- 603304b: Updated the max height in case of variant `fullHeight` to be `none` by default. That is needed to really occupy the full height of the container.

## 0.5.4

### Patch Changes

- ae965c0: Fix broken workspace dependencies

## 0.5.3

### Patch Changes

- e6a9982: Troubleshooting "no readme file" error
- f09fe96: Added fullpage support
- b3faeda: Fixed so that Readme Dialog always have a min width. In that case, if it is not smuch markdown content, the dialog wont be weirdly small.

## 0.5.2

### Patch Changes

- 050e48d: Replace all Mui Grid v1 with v2

## 0.5.1

### Patch Changes

- 0613d84: Updated the notes in the README.md about backend installation and setup in Jira Dashboard plugin and README plugin
- b445aaa: Update @mui & @emotion dependencies

## 0.5.0

### Minor Changes

- 08961a1: Bump to react v.18 in app and plugins, and updated dependencies. "peer" is now react 18 + 17. Removed react v. 16.13.1

## 0.4.0

### Minor Changes

- 864d983: Bumped Backstage version to v.1.22.0

## 0.3.0

### Minor Changes

- 23ff76a: Bumped Backstage version to v.1.21.0 in whole monorepo
- 7d79c04: Bumped Readme frontend plugin to use Material UI v.5 components. Made necessary changes to the code.

## 0.2.0

### Minor Changes

- a67c963: Bumped Backstage to version 1.20.3
