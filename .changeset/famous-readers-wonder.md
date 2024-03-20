---
'@axis-backstage/plugin-jira-dashboard-backend': major
---

Updated the getIssuesByFilter function to accept an array of components,
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
