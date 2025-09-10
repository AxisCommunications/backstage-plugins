# @axis-backstage/plugin-jira-dashboard-backend

## 4.9.1

### Patch Changes

- Updated dependencies [276e489]
  - @axis-backstage/plugin-jira-dashboard-common@1.14.1

## 4.9.0

### Minor Changes

- db452c4: Updated to Backstage v1.42.5

### Patch Changes

- Updated dependencies [db452c4]
  - @axis-backstage/plugin-jira-dashboard-common@1.14.0

## 4.8.1

### Patch Changes

- 91be7b5: Only the filter.query was passed to the getIssuesFromFilters function, which cased the filter not to be applied in backend. Now, thw whole jql query is passed to the api.

## 4.8.0

### Minor Changes

- 70256ff: Add jql annotation to the Jira plugins to allow fully customization of the issues displayed in the Jira Dashboard

### Patch Changes

- Updated dependencies [70256ff]
  - @axis-backstage/plugin-jira-dashboard-common@1.13.0

## 4.7.0

### Minor Changes

- 798d630: Add a new 'apiUrl' config parameter which can be used for scoped API tokens

## 4.6.0

### Minor Changes

- 86c01b7: Bumped to Backstage 1.40

### Patch Changes

- Updated dependencies [86c01b7]
  - @axis-backstage/plugin-jira-dashboard-common@1.12.0

## 4.5.1

### Patch Changes

- 99c44e9: Fix incorrect 404 response

## 4.5.0

### Minor Changes

- 15f1ee8: Support Multiple Jira Project Cards in Tabbed View

### Patch Changes

- Updated dependencies [15f1ee8]
  - @axis-backstage/plugin-jira-dashboard-common@1.11.0

## 4.4.1

### Patch Changes

- 39d98e4: Each project key in the JQL query are now wrapped in single qoutes to handle projects that contains reserved JQL words.

## 4.4.0

### Minor Changes

- ede8341: Updated to Backstage v1.36.1.

### Patch Changes

- Updated dependencies [ede8341]
  - @axis-backstage/plugin-jira-dashboard-common@1.10.0

## 4.3.1

### Patch Changes

- 22754be: Remove unused `@backstage/backend-common` package dependency.

## 4.3.0

### Minor Changes

- b3b6065: Adds ability to use an optional provided Jira filter defined in app-config for JiraUserIssuesViewCard

## 4.2.0

### Minor Changes

- 3f9ac75: Support Multiple Project Keys in JQL Query Builder
  Issue https://github.com/AxisCommunications/backstage-plugins/issues/232

  Signed-off-by: enaysaa <saachi.nayyer@ericsson.com>

## 4.1.1

### Patch Changes

- 82161b3: Fixed so JiraDashboard content can read config value from app-config file.

## 4.1.0

### Minor Changes

- 24aff26: Support for user defined additional filters
  Issue https://github.com/AxisCommunications/backstage-plugins/issues/210

  Signed-off-by: enaysaa <saachi.nayyer@ericsson.com>

### Patch Changes

- 8148766: The `callApi` function is now exported to make it easy to use the `jira-dashboard-backend`
  configuration in any Backstage plugin.

## 4.0.3

### Patch Changes

- 1b47182: The backend now exports the `JiraConfig` class. This is needed to create config
  instances for the `searchJira`function.

## 4.0.2

### Patch Changes

- Updated dependencies [060bcf6]
  - @axis-backstage/plugin-jira-dashboard-common@1.9.1

## 4.0.1

### Patch Changes

- eab8f06: Added support for configuring custom headers for API requests

## 4.0.0

### Major Changes

- 18fba21: BREAKING: The backend has been migrated to the new backend system. The createRouter function now requires the new auth and httpAuth services to be passed in, instead of the removed identity and tokenManager services. If you are using the new backend system module, this does not affect you.
- 18fba21: Introduced TypeScript type definitions SearchJiraResponse and JiraQueryResults to represent Jira search responses and pagination details.
  Updated the searchJira function to return search results as a SearchJiraResponse, incorporating the new types.
  The searchJira function now returns an object containing both the search results and the HTTP status code, improving error resilience and clarity in handling search operations.
  The JiraQueryResults type outlines the structure of a paginated Jira search response, facilitating better data handling.
  These changes streamline the Jira Dashboard plugin's codebase, improving error resilience and clarity in handling search operations.

### Minor Changes

- 18fba21: Add support for multiple Jira instances

### Patch Changes

- 6c9c4b6: Fixed caching of user issues when having multiple Jira instances.
- Updated dependencies [18fba21]
- Updated dependencies [18fba21]
  - @axis-backstage/plugin-jira-dashboard-common@1.9.0

## 3.1.0

### Minor Changes

- 39b1dbf: Add support for multiple Jira instances

### Patch Changes

- Updated dependencies [39b1dbf]
  - @axis-backstage/plugin-jira-dashboard-common@1.8.0

## 3.0.0

### Major Changes

- b6b406c: BREAKING: The backend has been migrated to the new backend system. The createRouter function now requires the new auth and httpAuth services to be passed in, instead of the removed identity and tokenManager services. If you are using the new backend system module, this does not affect you.

## 2.7.0

### Minor Changes

- d3129c0: Adding jql query to support links within JiraTable title

### Patch Changes

- Updated dependencies [d3129c0]
  - @axis-backstage/plugin-jira-dashboard-common@1.7.0

## 2.6.1

### Patch Changes

- 65ae7b3: Removed deprecated types and fixed the standalone server
- 1db0ada: Marked `createRouter` and `RouterOptions` as deprecated, to be removed soon after the Backstage `1.32.0` release in October
- 56e84d6: Quote the incoming status string in the JQL. This makes it possible to have strings that contain whitespace.

## 2.6.0

### Minor Changes

- 9bc46fc: New component - JiraUserIssuesCardView - listing user issues view for current logged user

### Patch Changes

- Updated dependencies [9bc46fc]
  - @axis-backstage/plugin-jira-dashboard-common@1.6.0

## 2.5.0

### Minor Changes

- 6fd284d: Updated to Backstage v1.30.1.

### Patch Changes

- Updated dependencies [6fd284d]
  - @axis-backstage/plugin-jira-dashboard-common@1.5.0

## 2.4.0

### Minor Changes

- 0b948ea: Generate pluginIds for plugins and bumping @backstage/cli

### Patch Changes

- Updated dependencies [0b948ea]
  - @axis-backstage/plugin-jira-dashboard-common@1.4.0

## 2.3.1

### Patch Changes

- Updated dependencies [e416aff]
  - @axis-backstage/plugin-jira-dashboard-common@1.3.0

## 2.3.0

### Minor Changes

- 916589b: Bumped Backstage to v.27.7 and removed the TechRadar plugin since it was not used and caused problems with the new version.

### Patch Changes

- Updated dependencies [916589b]
  - @axis-backstage/plugin-jira-dashboard-common@1.2.0

## 2.2.0

### Minor Changes

- 0ec1f12: Created the incoming-issues-annotation to make it possible for users to define Jira status for Incoming issues other than "New". Made some smaller refactoring in filter.ts to create better consistency among functions.
- 56c3a07: The Backstage user entity profile email is now used as default for "Assigned to me" filters. Made the JIRA_EMAIL_SUFFIX optional, so it still can be used if Backstage email does not match the one in Jira.

### Patch Changes

- 7f0b7cd: Added additional documentation how to authenticate with Jira.
- Updated dependencies [0ec1f12]
  - @axis-backstage/plugin-jira-dashboard-common@1.1.0

## 2.1.0

### Minor Changes

- 5fd2a31: Querying for components that contain spaces should now return the expected results. Component
  names is now wrapped in single quotations.

  Added the `jqlQueryBuilder` function that will create a JQL query based on the arguments. This is
  exported from the backend plugin to be used outside the context of the plugin together with the
  `searchJira` function.

### Patch Changes

- 11822da: Enhance error message when querying for projects

## 2.0.0

### Major Changes

- 0535af4: **BREAKING** The Jira dashboard backend now uses the new auth service introduced in Backstage v1.24.0. This is only applicable when using this plugin in the new Backstage backend. This could break the usage in Backstage installations older than v1.24.0 if the new backend system is used.

### Patch Changes

- 0535af4: Bumped backstage dependencies to match 1.26.0
- 0535af4: Updated the installation instructions for the new backend system.
- Updated dependencies [0535af4]
  - @axis-backstage/plugin-jira-dashboard-common@1.0.1

## 1.0.0

### Major Changes

- 9456530: Updated the getIssuesByFilter function to accept an array of components,
  enabling the construction of more flexible JQL queries.
  Introduced a new variable named componentQuery to represent the portion of the JQL query related to components.

  Enhanced the getIssuesFromFilters function to include support for filtering by components.
  Now, along with project keys and filters, the function also accepts an array of components.
  This change allows for more comprehensive filtering options when retrieving issues from Jira.

  Modified the router implementation to pass the array of components to the getIssuesFromFilters function.
  By including components in the request, users can now specify additional criteria for filtering Jira issues,
  resulting in more refined search results.

  The introduced changes provide users with greater flexibility and control when retrieving Jira issues,
  allowing for more precise filtering based on project keys, components, and filter criteria.
  This enhancement improves the overall usability and effectiveness of the Jira integration functionality.

### Patch Changes

- Updated dependencies [517c68a]
  - @axis-backstage/plugin-jira-dashboard-common@1.0.0

## 0.7.4

### Patch Changes

- f23bacd: added content type header to searchJira call

## 0.7.3

### Patch Changes

- f3203e9: Fix dependencies in published packages

## 0.7.2

### Patch Changes

- 5bb3330: Added and exported a function `searchJira` that searches for Jira issues using
  JQL. This can be used outside this plugin to search for issues. For more information about the available options see the API documentation at
  [issue search](https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issue-search/#api-rest-api-2-search-post).

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
