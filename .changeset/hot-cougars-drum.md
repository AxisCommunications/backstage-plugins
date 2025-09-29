---
'@axis-backstage/plugin-analytics-module-umami': minor
'app': minor
---

Adds optional distinct-user tracking to the analytics-module-umami plugin by wiring Backstage’s identityApi into the Umami analytics payloads (sets payload.id to the user’s Backstage entity ref). Includes tests, README updates, and a small refactor for clarity.
