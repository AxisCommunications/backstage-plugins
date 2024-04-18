---
'@axis-backstage/plugin-jira-dashboard': major
'app': minor
'backend': minor
'@axis-backstage/plugin-analytics-module-umami': minor
'@axis-backstage/plugin-jira-dashboard-backend': minor
'@axis-backstage/plugin-jira-dashboard-common': minor
'@axis-backstage/plugin-readme': minor
'@axis-backstage/plugin-readme-backend': minor
'@axis-backstage/plugin-statuspage': minor
'@axis-backstage/plugin-statuspage-backend': minor
'@axis-backstage/plugin-statuspage-common': minor
---

Implemented project key support for fetching Jira data in the Jira Dashboard plugin.
Updated the getJiraResponseByEntity method signature in JiraDashboardApi.tsx to include a projectKey parameter.
Enhanced the JiraDashboardContent.tsx file to extract the project key from entity metadata annotations and pass it to the useJira hook.
Modified the JiraTable.tsx file to include an optional prop project of type Project to accommodate the project key.
Updated the useJira.ts file to include the projectKey parameter in the useJira hook signature and pass it to the getJiraResponseByEntity method.