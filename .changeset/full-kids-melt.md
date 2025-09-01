---
'@axis-backstage/plugin-jira-dashboard-backend': patch
---

Only the filter.query was passed to the getIssuesFromFilters function, which cased the filter not to be applied in backend. Now, thw whole jql query is passed to the api.
