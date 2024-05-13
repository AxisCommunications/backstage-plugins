---
'@axis-backstage/plugin-jira-dashboard-backend': major
'@axis-backstage/plugin-jira-dashboard-common': minor
---

Introduced TypeScript type definitions SearchJiraResponse and JiraQueryResults to represent Jira search responses and pagination details.
Updated the searchJira function to return search results as a SearchJiraResponse, incorporating the new types.
The searchJira function now returns an object containing both the search results and the HTTP status code, improving error resilience and clarity in handling search operations.
The JiraQueryResults type outlines the structure of a paginated Jira search response, facilitating better data handling.
These changes streamline the Jira Dashboard plugin's codebase, improving error resilience and clarity in handling search operations.
