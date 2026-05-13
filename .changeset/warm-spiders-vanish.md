---
'@axis-backstage/plugin-statuspage': minor
---

Add support for the new frontend system (NFS). The plugin can now be imported from the `./alpha` entry point and registered as a feature in a new-system app.

The plugin provides three extensions out of the box:

- `api:statuspage` — registers the `StatuspageClient`
- `page:statuspage` — mounts the full statuspage at `/statuspage`
- `entity-card:statuspage` — renders the `StatuspageEntityCard` on entity pages

Configure the instance name for the page extension in `app-config.yaml`:

```yaml
app:
  extensions:
    - page:statuspage:
        config:
          name: mystatuspageinstance
```
