---
'@axis-backstage/plugin-jira-dashboard-backend': patch
'@axis-backstage/plugin-jira-dashboard-common': patch
---

Add MCP tool action to fetch Jira ticket information. Introduces `get-jira-ticket-info` action that retrieves summary and description for a specific Jira ticket by its key, with support for multiple Jira instances.
