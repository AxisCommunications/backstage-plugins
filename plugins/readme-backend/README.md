# Readme backend

Welcome to the readme backend plugin!

The plugin retrieves README files from the entity source location. The corresponding frontend plugin responsible for displaying this information is the [Readme plugin](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/readme).

## Setup

The following sections will help you get the Readme Backend plugin setup and running.

### Installation

Install the plugin by following the example below:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @axis-backstage/plugin-readme-backend
```

### Integrating

Here's how to get the backend plugin up and running:

In your `packages/backend/src/index.ts` make the following changes:

```diff

const backend = createBackend();
+ backend.add(import('@axis-backstage/plugin-readme-backend'));
// ... other feature additions

backend.start();
```

### Search Integration

The readme backend plugin provides a search collator that makes README content searchable through Backstage's search functionality. To enable search indexing for README files, add the search module to your backend:

```diff
const backend = createBackend();
backend.add(import('@axis-backstage/plugin-readme-backend'));
+ backend.add(
+   import('@axis-backstage/plugin-readme-backend').then(m => m.readmeSearchModule),
+ );
backend.add(import('@backstage/plugin-search-backend'));
// ... other feature additions

backend.start();
```

The search collator will:
- Index README content from all catalog entities
- Update the search index every hour by default (configurable)
- Strip markdown formatting for better search results
- Include entity metadata (kind, namespace, name) in search documents

Once configured, users can search for README content directly from the Backstage search bar, and results will link to the corresponding entity's catalog page.

To customize the search indexing schedule, add the following to your `app-config.yaml`:

```yaml
readme:
  search:
    schedule:
      frequency: { minutes: 30 }
      timeout: { minutes: 30 }
      initialDelay: { seconds: 3 }
```

### Configuration

This plugin does not require any configuration. It has a default configuration
with a set of README file names that it will look for in the entity source location. The actual file to use and the order to look for them can be
configured in the `app-config.yaml` file using the "readme.fileNames" configuration key. This is a simple list of file names to look for in the entity source location.

```yaml
readme:
  fileNames:
    - README.txt
    - README.text
    - README.markdown
```

To override the default TTL of the internal cache, a duration can be set using the `cacheTtl` key. This can be either a string
or an object. The following examples are equal:

```yaml
readme:
  cacheTtl:
    hours: 2
```

```yaml
readme:
  cacheTtl: '2h'
```

To configure the search indexing schedule (defaults to every hour), use the `search.schedule` key:

```yaml
readme:
  search:
    schedule:
      frequency: { minutes: 30 }  # How often to run
      timeout: { minutes: 30 }     # Maximum execution time (optional)
      initialDelay: { seconds: 3 } # Delay before first run (optional)
```

The schedule can also be configured using string format:

```yaml
readme:
  search:
    schedule:
      frequency: '30m'
      timeout: '30m'
```

Or using cron syntax for more complex schedules:

```yaml
readme:
  search:
    schedule:
      frequency:
        cron: '0 */2 * * *'  # Every 2 hours
```

Complete configuration example:

```yaml
readme:
  fileNames:
    - README.md
    - README.rst
  cacheTtl: '1h'
  search:
    schedule:
      frequency: { hours: 1 }
      timeout: { hours: 1 }
      initialDelay: { seconds: 3 }
```

### Troubleshooting

If the backend fails to provide README content for an entity, it could be due to several reasons.

#### No Integration Found for Entity

This error message indicates that there is no current integration with the external provider where the README file is located, such as GitHub, GitLab, or Gerrit. When the integration is missing, the backend does not have permission to access the README content.

To resolve this issue, set up the integration for the external provider where the README file is located. You can find more information about Backstage integrations in the [Backstage upstream documentation](https://backstage.io/docs/integrations/).

#### Not a Valid Location for Source Target

This error means that the entity source location cannot be found or is not a valid URL. The `entity source location` is always the same directory as the catalog-info.yaml file.

To debug this error, ensure that the entity source location is valid for the current entity. You can find the entity source location in the entity's catalog-info.yaml file. See the example below:

```yaml
annotations:
  backstage.io/source-location: url:https://github.com/AxisCommunications/backstage-plugins/blob/main/
```

#### README Not Found for Entity

This error indicates that no README, README.md, README.rst, README.txt, or README.MD file was found for that entity. To resolve this error, ensure that there is a README file located in the entity source location with one of the following formats: **md**, **rst**, or **txt**. The plugin can also handle symlinks.
