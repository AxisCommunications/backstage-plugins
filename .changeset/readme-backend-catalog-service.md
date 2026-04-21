---
'@axis-backstage/plugin-readme-backend': patch
---

Replaced internally constructed `CatalogClient` with the injected `CatalogService` from `@backstage/plugin-catalog-node`. This removes the dependency on `@backstage/catalog-client` and `@backstage/backend-defaults`, improves testability, and fixes unawaited cache writes.
