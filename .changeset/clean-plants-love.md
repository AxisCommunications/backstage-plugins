---
'@axis-backstage/plugin-jira-dashboard-backend': major
---

Added support for Jira Cloud API V3

Added useApiV3 configuration option to enable Jira REST API v3 support. The "/api/2/search"
API used by the Jira Data Center is deprecated and may not be available in Jira Cloud.

Configuration Changes:

Added optional useApiV3 boolean field to the Jira dashboard configuration
When useApiV3: true, API calls use the /search/jql endpoint instead of /search
When useApiV3: false or not specified, continues to use the existing v2 /search endpoint

Example configuration for Jira Cloud to use the v3 Api.

```
jiraDashboard:
baseUrl: 'https://your-jira.atlassian.net/rest/api/3/'
token: 'your-token'
useApiV3: true
```
