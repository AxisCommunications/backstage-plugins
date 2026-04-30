---
'@axis-backstage/plugin-readme': minor
---

Added a `hideIfNotFound` config option to the readme card extension for
the new frontend system. When set to `true`, the entire card is hidden
when no README.md file is found, instead of showing an error message.
This is the NFS equivalent of the `isReadmeAvailable` entity filter
available in the old frontend system.

Example app-config.yaml:

app:
extensions: - entity-card:readme:
config:
hideIfNotFound: true
