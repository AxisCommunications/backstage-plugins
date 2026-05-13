---
'@axis-backstage/plugin-readme': patch
---

NFS: Make the Readme entity card height configurable

The height of the entity card now defaults to the same height as
the legacy card. If used in NFS the height can be configured
using the config as follows:

```yaml
app:
  extensions:
    - entity-card:readme:
        config:
          hideIfNotFound: true
          maxHeight: 500px
```
