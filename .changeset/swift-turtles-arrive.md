---
'@axis-backstage/plugin-jira-dashboard-backend': minor
'@axis-backstage/plugin-jira-dashboard-common': minor
'@axis-backstage/plugin-jira-dashboard': minor
---

Created optional ANNOTATION_PREFIX config in backend to make it possible to define custom annotations. The jira.com annotation is still used if no config value is provided. Also removed check for annotation in frontend and only return error message 'Could not fetch Jira Dashboard content for defined project key' if no Jira data is returned from backend.
