---
'@axis-backstage/plugin-jira-dashboard-backend': major
---

Implemented a new GET endpoint in the router.ts file to provide compatibility with the existing POST endpoint in the api.ts file. This endpoint allows users to retrieve Jira issues using the provided JQL query and query parameters, enabling flexibility in choosing the HTTP method that best suits their needs. Additionally, this implementation allows users to utilize the response for other plugins interacting with Jira.
