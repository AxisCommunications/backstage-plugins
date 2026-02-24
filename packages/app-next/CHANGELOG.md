# app-next

## 0.1.8

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

- Updated dependencies [199bd49]
  - @axis-backstage/plugin-jira-dashboard@2.3.1

## 0.1.7

### Patch Changes

- Updated dependencies [7d98ad2]
  - @axis-backstage/plugin-jira-dashboard-common@1.15.0
  - @axis-backstage/plugin-jira-dashboard@2.3.0

## 0.1.6

### Patch Changes

- Updated dependencies [68f822b]
  - @axis-backstage/plugin-jira-dashboard@2.2.3

## 0.1.5

### Patch Changes

- Updated dependencies [4258139]
  - @axis-backstage/plugin-jira-dashboard-common@1.14.2
  - @axis-backstage/plugin-jira-dashboard@2.2.2

## 0.1.4

### Patch Changes

- Updated dependencies [276e489]
  - @axis-backstage/plugin-jira-dashboard-common@1.14.1
  - @axis-backstage/plugin-jira-dashboard@2.2.1

## 0.1.3

### Patch Changes

- Updated dependencies [db452c4]
- Updated dependencies [db452c4]
  - @axis-backstage/plugin-jira-dashboard@2.2.0
  - @axis-backstage/plugin-jira-dashboard-common@1.14.0

## 0.1.2

### Patch Changes

- Updated dependencies [70256ff]
  - @axis-backstage/plugin-jira-dashboard-common@1.13.0
  - @axis-backstage/plugin-jira-dashboard@2.1.0

## 0.1.1

### Patch Changes

- Updated dependencies [818c231]
- Updated dependencies [a04b26a]
  - @axis-backstage/plugin-jira-dashboard@2.0.0

## 0.1.0

### Minor Changes

- 86c01b7: Bumped to Backstage 1.40

### Patch Changes

- Updated dependencies [86c01b7]
  - @axis-backstage/plugin-jira-dashboard-common@1.12.0
  - @axis-backstage/plugin-jira-dashboard@1.20.0

## 0.0.4

### Patch Changes

- Updated dependencies [15f1ee8]
  - @axis-backstage/plugin-jira-dashboard-common@1.11.0
  - @axis-backstage/plugin-jira-dashboard@1.19.0

## 0.0.3

### Patch Changes

- Updated dependencies [e1f7899]
  - @axis-backstage/plugin-jira-dashboard@1.18.0

## 0.0.2

### Patch Changes

- Updated dependencies [cc468bd]
  - @axis-backstage/plugin-jira-dashboard@1.17.0
