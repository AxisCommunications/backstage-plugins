# @axis-backstage/plugin-jira-dashboard

## 1.21.0

### Minor Changes

- 818c231: The dashboard should automatically adjust its layout based on the screen size. Cards should maintain a minimum width for readability and stack into a single-column layout if they don't fit side by side. There should be no horizontal scrolling or broken layouts on smaller screens

## 1.20.0

### Minor Changes

- 86c01b7: Bumped to Backstage 1.40

### Patch Changes

- Updated dependencies [86c01b7]
  - @axis-backstage/plugin-jira-dashboard-common@1.12.0

## 1.19.0

### Minor Changes

- 15f1ee8: Support Multiple Jira Project Cards in Tabbed View

### Patch Changes

- Updated dependencies [15f1ee8]
  - @axis-backstage/plugin-jira-dashboard-common@1.11.0

## 1.18.0

### Minor Changes

- e1f7899: The `EntityJiraDashboardContent` component accepts `tableOptions` as a prop, allowing for enhanced table configuration and customization.

## 1.17.0

### Minor Changes

- cc468bd: New frontend system now only applies Jira tab to entities with the correct annotation, reading from config to grab the right prefix.

## 1.16.0

### Minor Changes

- ede8341: Updated to Backstage v1.36.1.

### Patch Changes

- Updated dependencies [ede8341]
  - @axis-backstage/plugin-jira-dashboard-common@1.10.0

## 1.15.0

### Minor Changes

- b3b6065: Adds ability to use an optional provided Jira filter defined in app-config for JiraUserIssuesViewCard

## 1.14.3

### Patch Changes

- 66bac1a: Added tableOptions and tableStyle props to JiraUserIssuesCard for customization ability

## 1.14.2

### Patch Changes

- d166111: Add the "config.d.ts" file to the "files" in package.json.

## 1.14.1

### Patch Changes

- 82161b3: Fixed so JiraDashboard content can read config value from app-config file.

## 1.14.0

### Minor Changes

- a5a12f8: Jira Dashboard Table - Table Options - missing property

  - quick fix - missing passing tableOptions to Jira issues Table component

## 1.13.5

### Patch Changes

- 95a21f0: Jira Dashboard Table - Added support for table options property

  - now you have options to make the table also pageable, hide toolbar etc.
  - for Jira Dashboard Card the table is pageable now by default

## 1.13.4

### Patch Changes

- 7fbce31: Export `jiraDashboardApiRef` and `JiraDashboardClient` for manual registration of the
  api.

## 1.13.3

### Patch Changes

- 4204413: Dependency updates

## 1.13.2

### Patch Changes

- 060bcf6: Check if the `issues` field is set before use
- Updated dependencies [060bcf6]
  - @axis-backstage/plugin-jira-dashboard-common@1.9.1

## 1.13.1

### Patch Changes

- a5c7b33: Extracted the table component from JiraUserIssuesViewCard into an exported component JiraUserIssuesTable, and added styling options to the table (or its outer Card) to adapt it more freely

## 1.13.0

### Minor Changes

- 18fba21: Add support for multiple Jira instances

### Patch Changes

- Updated dependencies [18fba21]
- Updated dependencies [18fba21]
  - @axis-backstage/plugin-jira-dashboard-common@1.9.0

## 1.12.0

### Minor Changes

- 39b1dbf: Add support for multiple Jira instances

### Patch Changes

- Updated dependencies [39b1dbf]
  - @axis-backstage/plugin-jira-dashboard-common@1.8.0

## 1.11.0

### Minor Changes

- d3129c0: Adding jql query to support links within JiraTable title

### Patch Changes

- Updated dependencies [d3129c0]
  - @axis-backstage/plugin-jira-dashboard-common@1.7.0

## 1.10.0

### Minor Changes

- 89498d5: Adding filters to the Jira Table

## 1.9.0

### Minor Changes

- 9bc46fc: Tweaking columns in JiraTable

  - Columns definitions are separated to be reusable
  - Priority column title shortened to 'P', and added a tooltip with full name, priority indicated by original Jira icon

- 9bc46fc: New component - JiraUserIssuesCardView - listing user issues view for current logged user

### Patch Changes

- Updated dependencies [9bc46fc]
  - @axis-backstage/plugin-jira-dashboard-common@1.6.0

## 1.8.1

### Patch Changes

- 911d8e2: fix rendering discovered since 1.3.0

## 1.8.0

### Minor Changes

- 6b87d44: Add peer dependencies (react-router-dom, material-ui/core, types/react)

## 1.7.0

### Minor Changes

- 6889f99: Add react-dom as a peer-dependency

### Patch Changes

- 68fed13: Make entity content appear on components & groups only by default in new FE system

## 1.6.0

### Minor Changes

- 6fd284d: Updated to Backstage v1.30.1.

### Patch Changes

- Updated dependencies [6fd284d]
  - @axis-backstage/plugin-jira-dashboard-common@1.5.0

## 1.5.0

### Minor Changes

- 95e7ef8: Adds support for Backstage's new frontend system, available via the `/alpha` sub-path export.

## 1.4.0

### Minor Changes

- 0b948ea: Generate pluginIds for plugins and bumping @backstage/cli

### Patch Changes

- Updated dependencies [0b948ea]
  - @axis-backstage/plugin-jira-dashboard-common@1.4.0

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
