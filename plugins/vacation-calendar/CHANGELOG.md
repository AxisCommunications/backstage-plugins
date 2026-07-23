# @axis-backstage/plugin-vacation-calendar

## 0.11.2

### Patch Changes

- e9c8973: Fix broken user links in the vacation calendar. Users are now matched by email instead of metadata.name, and links use EntityRefLink for correct catalog URLs. Unresolved users render without a link instead of navigating to `/user/undefined`. Catalog queries now paginate to support large groups.

## 0.11.1

### Patch Changes

- 85be688: Fix broken timeline layout in consuming apps. The `react-calendar-timeline`
  package declares `sideEffects: false` with no exception for CSS, so its base
  stylesheet was tree-shaken out of the bundle when this plugin was consumed by
  a host app (it only appeared to work in this plugin's own dev server, which
  does not tree-shake). The base timeline styles are now inlined into this
  plugin's own CSS file, and the `sideEffects` field is updated to also cover
  the compiled `*.css.esm.js` output so it survives bundling.

## 0.11.0

### Minor Changes

- 78d19b9: Migrate the vacation calendar to Backstage UI, TanStack Query v5, Day.js, and
  react-calendar-timeline v0.30. The calendar now uses a Backstage UI date picker.

  The migration removes a number of legacy Material UI, date-picker, and timeline
  dependencies.

  **Breaking:** Consumers must install and configure `@backstage/ui`.

### Patch Changes

- 2569fb1: Updated to Backstage 1.52.1

## 0.10.1

### Patch Changes

- 8ce6673: Updated lodash dependency, updated tests to use msw 2.

## 0.10.0

### Minor Changes

- 38477a3: Sort user calendars alphabetically by display name on the frontend, providing a consistent and predictable user experience. Includes comprehensive tests covering sorting, edge cases, and highlight logic.

## 0.9.3

### Patch Changes

- 28e5257: Added new frontend system (NFS) support via a new `./alpha` entry point. The plugin exposes an `EntityContentBlueprint` that renders the Out of Office calendar as an entity content tab, and an `ApiBlueprint` for the vacation calendar API.

## 0.9.2

### Patch Changes

- 36858a7: Bumped to backstage 1.50.2

## 0.9.1

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

## 0.9.0

### Minor Changes

- 7d98ad2: Bumped to backstage 1.46.2

## 0.8.0

### Minor Changes

- db452c4: Updated to Backstage v1.42.5

## 0.7.0

### Minor Changes

- 86c01b7: Bumped to Backstage 1.40

## 0.6.0

### Minor Changes

- ede8341: Updated to Backstage v1.36.1.

## 0.5.0

### Minor Changes

- 6fd284d: Updated to Backstage v1.30.1.

## 0.4.0

### Minor Changes

- a30ae43: Added required imports to installation guide in README.md in vacation calendar plugin.

### Patch Changes

- 306fcb8: Add moment to dependecies in vacation-calendar package.json to resolve 'Can't resolve 'moment' in .../node_modules/react-calendar-timeline/lib/lib/items'

## 0.3.0

### Minor Changes

- 0b948ea: Generate pluginIds for plugins and bumping @backstage/cli

## 0.2.0

### Minor Changes

- e416aff: Added new plugin for displaying out-of-office events in a react-calendar-timeline. Also added support for microsoft autentication.

### Patch Changes

- e12733a: Updated package.json to make package public and enable version packaging.
