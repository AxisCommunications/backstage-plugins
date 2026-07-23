---
'@axis-backstage/plugin-vacation-calendar': patch
---

Fix broken user links in the vacation calendar. Users are now matched by email instead of metadata.name, and links use EntityRefLink for correct catalog URLs. Unresolved users render without a link instead of navigating to `/user/undefined`. Catalog queries now paginate to support large groups.
