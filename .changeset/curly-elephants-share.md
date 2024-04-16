---
'@axis-backstage/plugin-readme-backend': minor
'@axis-backstage/plugin-readme': minor
---

Readme backend APIs adjusted to consume entityRef as /:kind/:namespace/:name. Fixes a 404 routing issue where a proxy like oauth2Proxy could decode the URI encoded path parameter /:entityRef known to contain the reserved path delimiter '/'.
