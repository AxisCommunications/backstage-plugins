---
'@axis-backstage/plugin-readme-backend': patch
---

Store `not found` results for entities.

If no README is found for an entity we now store that in the
cache so Backstage will not try again until the cache has
been invalidated.
