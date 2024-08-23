# @axis-backstage/plugin-readme

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
