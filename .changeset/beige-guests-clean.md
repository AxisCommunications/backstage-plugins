---
'@axis-backstage/plugin-jira-dashboard-backend': patch
---

Added and exported a function `searchJira` that searches for Jira issues using
JQL. This can be used outside this plugin to search for issues. For more information about the available options see the API documentation at
[issue search](https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issue-search/#api-rest-api-2-search-post).
