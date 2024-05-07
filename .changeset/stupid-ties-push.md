---
'@axis-backstage/plugin-jira-dashboard-backend': minor
---

Querying for components that contain spaces should now return the expected results. Component
names is now wrapped in single quotations.

Added the `jqlQueryBuilder` function that will create a JQL query based on the arguments. This is
exported from the backend plugin to be used outside the context of the plugin together with the
`searchJira` function.
