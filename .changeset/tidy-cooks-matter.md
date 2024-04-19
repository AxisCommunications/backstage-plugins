---
'@axis-backstage/plugin-readme-backend': minor
---

**BREAKING** The Readme backend now uses the new auth service introduced in Backstage v1.24.0. This is only applicable when using this plugin in the new Backstage backend. This could break the usage in Backstage installations older than v1.24.0 if the new backend system is used.
