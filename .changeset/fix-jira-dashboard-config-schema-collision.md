---
'@axis-backstage/plugin-jira-dashboard': patch
---

Fix `config:check --strict` failures caused by a schema collision between the frontend and backend Jira Dashboard config schemas. The frontend plugin no longer re-declares the `jiraDashboard` config key; it relies on the backend's schema, which already exposes `annotationPrefix` to the frontend.
