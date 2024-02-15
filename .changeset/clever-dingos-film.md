---
'@axis-backstage/plugin-jira-dashboard-backend': minor
'@axis-backstage/plugin-jira-dashboard': minor
---

Dashboard and Avatar backend APIs adjusted to consume entityRef as /:kind/:namespace/:name. Fixes a 404 routing issue where a proxy like oauth2Proxy could decode the URI encoded path parameter /:entityRef known to contain the reserved path delimiter '/'.
