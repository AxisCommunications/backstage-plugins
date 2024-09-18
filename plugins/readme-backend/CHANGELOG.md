# @axis-backstage/plugin-readme-backend

## 0.9.2

### Patch Changes

- 176243f: Updated deprecated types and fixed the standalone server
- 1db0ada: Marked `createRouter` and `RouterOptions` as deprecated, to be removed soon after the Backstage `1.32.0` release in October
- 3bfe58a: Removed the tokenmanager as dependency for new backend system plugin definition.

## 0.9.1

### Patch Changes

- 65f00d4: Fixed missing auth argument to createRouter call

## 0.9.0

### Minor Changes

- 6fd284d: Updated to Backstage v1.30.1.

## 0.8.0

### Minor Changes

- 0b948ea: Generate pluginIds for plugins and bumping @backstage/cli

## 0.7.0

### Minor Changes

- 916589b: Bumped Backstage to v.27.7 and removed the TechRadar plugin since it was not used and caused problems with the new version.

## 0.6.1

### Patch Changes

- 882cfa7: Headers were being set after the response was sent, causing errors. Replaced break statements with return statements in the loop.

## 0.6.0

### Minor Changes

- 0535af4: **BREAKING** The Readme backend now uses the new auth service introduced in Backstage v1.24.0. This is only applicable when using this plugin in the new Backstage backend. This could break the usage in Backstage installations older than v1.24.0 if the new backend system is used.

### Patch Changes

- 0535af4: Bumped backstage dependencies to match 1.26.0
- 0535af4: Updated the installation instructions for the new backend system.

## 0.5.0

### Minor Changes

- 371f5fd: Readme backend APIs adjusted to consume entityRef as /:kind/:namespace/:name. Fixes a 404 routing issue where a proxy like oauth2Proxy could decode the URI encoded path parameter /:entityRef known to contain the reserved path delimiter '/'.

## 0.4.0

### Minor Changes

- 864d983: Bumped Backstage version to v.1.22.0

## 0.3.0

### Minor Changes

- 23ff76a: Bumped Backstage version to v.1.21.0 in whole monorepo

## 0.2.0

### Minor Changes

- a67c963: Bumped Backstage to version 1.20.3
