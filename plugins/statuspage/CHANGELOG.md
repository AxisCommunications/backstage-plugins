# @axis-backstage/plugin-statuspage

## 0.10.1

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

## 0.10.0

### Minor Changes

- 7d98ad2: Bumped to backstage 1.46.2

### Patch Changes

- Updated dependencies [7d98ad2]
  - @axis-backstage/plugin-statuspage-common@0.9.0

## 0.9.0

### Minor Changes

- db452c4: Updated to Backstage v1.42.5

### Patch Changes

- Updated dependencies [db452c4]
  - @axis-backstage/plugin-statuspage-common@0.8.0

## 0.8.0

### Minor Changes

- 86c01b7: Bumped to Backstage 1.40

### Patch Changes

- Updated dependencies [86c01b7]
  - @axis-backstage/plugin-statuspage-common@0.7.0

## 0.7.0

### Minor Changes

- ede8341: Updated to Backstage v1.36.1.

### Patch Changes

- Updated dependencies [ede8341]
  - @axis-backstage/plugin-statuspage-common@0.6.0

## 0.6.0

### Minor Changes

- 6fd284d: Updated to Backstage v1.30.1.

### Patch Changes

- Updated dependencies [6fd284d]
  - @axis-backstage/plugin-statuspage-common@0.5.0

## 0.5.1

### Patch Changes

- 6d21448: Fix circular dependencies

## 0.5.0

### Minor Changes

- 0b948ea: Generate pluginIds for plugins and bumping @backstage/cli

### Patch Changes

- Updated dependencies [0b948ea]
  - @axis-backstage/plugin-statuspage-common@0.4.0

## 0.4.0

### Minor Changes

- 916589b: Bumped Backstage to v.27.7 and removed the TechRadar plugin since it was not used and caused problems with the new version.

### Patch Changes

- Updated dependencies [916589b]
  - @axis-backstage/plugin-statuspage-common@0.3.0

## 0.3.4

### Patch Changes

- 0535af4: Bumped backstage dependencies to match 1.26.0
- Updated dependencies [0535af4]
  - @axis-backstage/plugin-statuspage-common@0.2.1

## 0.3.3

### Patch Changes

- ae965c0: Fix broken workspace dependencies

## 0.3.2

### Patch Changes

- 60b6270: Fix broken release

## 0.3.1

### Patch Changes

- 73b296f: Better README and small UI-fixes

## 0.3.0

### Minor Changes

- 32683b9: StatuspageEntityCard was route mounted incorrectly, which broke the component in certain cases.

## 0.2.1

### Patch Changes

- 050e48d: Replace all Mui Grid v1 with v2

## 0.2.0

### Minor Changes

- b445aaa: Initial Release of the Statuspage Plugin

### Patch Changes

- Updated dependencies [b445aaa]
  - @axis-backstage/plugin-statuspage-common@0.2.0
