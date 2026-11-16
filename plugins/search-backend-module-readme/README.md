# Search Backend Module for Readme

A search backend module for Backstage that indexes the README files of catalog
entities, making them searchable through the Backstage search page.

## Overview

The module registers a search collator that periodically:

- queries the catalog for entities that have a source location,
- fetches the README file of each entity from the
  [readme backend](../readme-backend) plugin, and
- indexes the content as documents of type `readme`.

Because the content is fetched from the readme backend, the module shares its
configuration (e.g. `readme.fileNames`, `readme.cacheTtl`) and cache with the
READMEs that are displayed on entity pages.

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @axis-backstage/plugin-search-backend-module-readme
```

Then add the module to your search backend, making sure that the readme
backend plugin is installed as well:

```typescript
// packages/backend/src/index.ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@axis-backstage/plugin-readme-backend'));
backend.add(import('@axis-backstage/plugin-search-backend-module-readme'));
// ...
backend.start();
```

### Frontend

In the new frontend system, README search results are rendered automatically
when the [readme plugin](../readme) is installed:

```tsx
// packages/app/src/App.tsx
import readmePlugin from '@axis-backstage/plugin-readme/alpha';

const app = createApp({
  features: [
    // ...
    readmePlugin,
  ],
});
```

For the legacy frontend system, see the
[readme plugin documentation](../readme#search-integration).

## Configuration

The module has a default schedule that runs every 10 minutes. To override it,
or to limit which entities are indexed, add configuration under
`search.collators.readme`:

```yaml
search:
  collators:
    readme:
      schedule:
        frequency: { minutes: 30 } # How often to index
        timeout: { minutes: 15 } # Maximum execution time
        initialDelay: { seconds: 3 } # Delay before first run
      filter: # Optional catalog filter, on queryEntities format
        kind: ['Component']
      locationTemplate: '/catalog/:namespace/:kind/:name'
      parallelismLimit: 10
```

The location template is used to generate the URL that search results link to
and accepts the `:namespace`, `:kind`, and `:name` arguments.

### Interaction with the readme backend cache

The collator fetches README content through the readme backend plugin, whose
content cache is controlled by `readme.cacheTtl` (default one hour). If the
collator schedule frequency equals the cache TTL, entries will typically have
expired by the time the collator runs, so every run refetches each README from
its source. For rate limited SCM providers, keep the collator schedule shorter
than the cache TTL (as the default does) so that most collator requests are
served from the backend's cache.

## Search Document Format

Each indexed README document includes:

- `title`: entity title with a `- README` suffix
- `text`: the README content, converted to plain text for markdown readmes and indexed as-is for plain text and reStructuredText readmes
- `location`: link to the entity page in the catalog
- `entityRef`: the full entity reference, e.g. `component:default/my-service`
- `kind`, `namespace`, `name`: the entity triplet
