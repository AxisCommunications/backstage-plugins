---
'@axis-backstage/plugin-jira-dashboard-backend': minor
'@axis-backstage/plugin-jira-dashboard': minor
---

Dashboard and Avatar backend APIs adjusted to consume entityRef as /:kind/:namespace/:name. Fixes issue with proxies such as oauth2Proxy from decoding the URI encodedpath parameter /:entityRef known to contain the path delimiter '/'.
