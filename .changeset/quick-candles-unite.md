---
'@axis-backstage/plugin-jira-dashboard-backend': patch
---

Refactored the Jira Dashboard backend to batch project keys into a single JQL query (getIssuesByFilter) and to run independent async operations concurrently with Promise.all / Promise.allSettled, reducing latency when multiple projects or filters are fetched.
