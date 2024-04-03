---
'@axis-backstage/plugin-jira-dashboard-backend': major
---

Introduced TypeScript type definitions SearchJiraResponse and JiraQueryResults to represent Jira search responses and pagination details.
Updated the searchJira function to return search results as a SearchJiraResponse, incorporating the new types.
Enhanced error handling in the searchJira function by handling HTTP response errors and logging them appropriately.
The JiraQueryResults type outlines the structure of a paginated Jira search response, facilitating better data handling.
These changes streamline the Jira Dashboard plugin's codebase, improving error resilience and clarity in handling search operations.
